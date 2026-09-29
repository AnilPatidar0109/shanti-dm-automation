from typing import Any, List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.db.repository import (
    dm_automation_repo,
    dm_automation_execution_repo,
    instagram_account_repo
)
from app.schemas.instagram import (
    DMAutomation as DMAutomationSchema,
    DMAutomationCreate,
    DMAutomationUpdate,
    DMAutomationExecution as DMAutomationExecutionSchema
)
from app.models.instagram import DMAutomation
from app.models.user import User
from app.core.config import settings

router = APIRouter()


@router.get("", response_model=List[DMAutomationSchema])
async def read_dm_automations(
    instagram_account_id: Optional[int] = None,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """Retrieve DM automations. If instagram_account_id is provided, filters by it."""
    if instagram_account_id:
        acc = await instagram_account_repo.get(db, id=instagram_account_id)
        if not acc or acc.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to access this Instagram account"
            )
        res = await db.execute(
            select(dm_automation_repo.model).filter(
                dm_automation_repo.model.instagram_account_id == instagram_account_id
            )
        )
        return res.scalars().all()
    
    user_accs = await instagram_account_repo.get_by_user_id(db, user_id=current_user.id)
    acc_ids = [acc.id for acc in user_accs]
    if not acc_ids:
        return []
        
    res = await db.execute(
        select(dm_automation_repo.model).filter(
            dm_automation_repo.model.instagram_account_id.in_(acc_ids)
        )
    )
    return res.scalars().all()


@router.post("", response_model=DMAutomationSchema, status_code=status.HTTP_201_CREATED)
async def create_dm_automation(
    obj_in: DMAutomationCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """Create a new DM automation rule."""
    acc = await instagram_account_repo.get(db, id=obj_in.instagram_account_id)
    if not acc or acc.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this Instagram account"
        )
    
    if obj_in.trigger_type in ("exact_keyword", "contains_keyword") and not obj_in.keyword:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Keyword is required for keyword trigger types"
        )

    aut = await dm_automation_repo.create(db, obj_in=obj_in.model_dump())
    await db.commit()
    await db.refresh(aut)
    return aut


@router.post("/upload")
async def upload_media(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """Upload media file for button template or image response."""
    import os
    import uuid
    import shutil

    # Validate file extension
    file_ext = os.path.splitext(file.filename or "")[1].lower()
    allowed_extensions = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{file_ext}'. Allowed formats: {', '.join(allowed_extensions)}"
        )

    # Ensure upload directory exists
    current_dir = os.path.dirname(os.path.abspath(__file__))
    for _ in range(4):
        current_dir = os.path.dirname(current_dir)
    uploads_dir = os.path.join(current_dir, "uploads")
    os.makedirs(uploads_dir, exist_ok=True)

    # Generate a unique file name
    filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(uploads_dir, filename)

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Resolve URL (prioritize configured public base URL, then forwarded host, then request.base_url)
    if settings.PUBLIC_BASE_URL:
        base_url = settings.PUBLIC_BASE_URL.rstrip("/")
        file_url = f"{base_url}/uploads/{filename}"
    else:
        forwarded_host = request.headers.get("x-forwarded-host")
        forwarded_proto = request.headers.get("x-forwarded-proto", "https")
        if forwarded_host:
            file_url = f"{forwarded_proto}://{forwarded_host}/uploads/{filename}"
        else:
            base_url = str(request.base_url).rstrip("/")
            file_url = f"{base_url}/uploads/{filename}"

    return {"url": file_url, "filename": file.filename}


@router.put("/{id}", response_model=DMAutomationSchema)
async def update_dm_automation(
    id: str,
    obj_in: DMAutomationUpdate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """Update a DM automation rule."""
    aut = await dm_automation_repo.get(db, id=id)
    if not aut:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DM Automation rule not found"
        )
    
    acc = await instagram_account_repo.get(db, id=aut.instagram_account_id)
    if not acc or acc.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to modify this automation"
        )
        
    aut = await dm_automation_repo.update(db, db_obj=aut, obj_in=obj_in.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(aut)
    return aut


@router.delete("/{id}", response_model=DMAutomationSchema)
async def delete_dm_automation(
    id: str,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """Delete a DM automation rule."""
    aut = await dm_automation_repo.get(db, id=id)
    if not aut:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DM Automation rule not found"
        )
        
    acc = await instagram_account_repo.get(db, id=aut.instagram_account_id)
    if not acc or acc.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to modify this automation"
        )
        
    aut = await dm_automation_repo.remove(db, id=id)
    await db.commit()
    return aut





@router.get("/executions", response_model=List[DMAutomationExecutionSchema])
async def read_dm_executions(
    instagram_account_id: Optional[int] = None,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """Retrieve logs of executed DM automation rules, scoped to after account connection."""
    user_accs = await instagram_account_repo.get_by_user_id(db, user_id=current_user.id)
    acc_ids = [acc.id for acc in user_accs]
    if instagram_account_id:
        if instagram_account_id not in acc_ids:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to access this Instagram account"
            )
        acc_ids = [instagram_account_id]
        user_accs = [acc for acc in user_accs if acc.id == instagram_account_id]

    if not acc_ids:
        return []

    query = (
        select(dm_automation_execution_repo.model)
        .join(DMAutomation, DMAutomation.id == dm_automation_execution_repo.model.automation_id)
        .filter(DMAutomation.instagram_account_id.in_(acc_ids))
    )
    # Always apply connected_at; fall back to utcnow() if NULL so nothing historical leaks
    all_connected_times = [acc.connected_at or datetime.utcnow() for acc in user_accs]
    query = query.filter(dm_automation_execution_repo.model.executed_at >= min(all_connected_times))

    res = await db.execute(query.order_by(dm_automation_execution_repo.model.executed_at.desc()))
    return res.scalars().all()


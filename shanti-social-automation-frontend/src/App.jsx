import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  GitFork,
  MessageSquare,
  History,
  Plus,
  Trash2,
  Save,
  Link2,
  Activity,
  TrendingUp,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  PauseCircle,
  Zap,
  Info,
  MessageCircle,
  Edit,
  LogOut,
  Film,
  Image as ImageIcon,
  Upload,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Check
} from 'lucide-react';

const InstagramIcon = ({ size = 16, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 16, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const checkIsFbPost = (post) => {
  if (!post) return false;
  return Boolean(post.facebook_account_id || post.facebook_page_id || post.is_facebook || (post.id && String(post.id).startsWith('fb_')));
};

const PostPreviewMedia = ({
  post,
  variant = 'card', // 'card', 'table', 'compact'
  style = {},
  showBadge = true
}) => {
  const [hasError, setHasError] = useState(false);

  const isFb = checkIsFbPost(post);
  const mediaUrl = post?.thumbnail_url || post?.media_url || null;
  const isVideo = Boolean(
    post?.media_type === 'reel' ||
    post?.media_type === 'video' ||
    post?.media_type === 'VIDEO' ||
    (post?.permalink && String(post.permalink).includes('/reel/'))
  );

  useEffect(() => {
    setHasError(false);
  }, [mediaUrl, post?.id]);

  if (variant === 'table') {
    return (
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: '#151622',
          flexShrink: 0,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          ...style
        }}
      >
        {mediaUrl && !hasError ? (
          <img
            src={mediaUrl}
            alt={post?.caption || "Post Preview"}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e1f30 0%, #11121a 100%)',
            color: isVideo ? '#a78bfa' : '#94a3b8'
          }}>
            {isVideo ? <Film size={18} /> : <ImageIcon size={18} />}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: '#151622',
          flexShrink: 0,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          ...style
        }}
      >
        {mediaUrl && !hasError ? (
          <img
            src={mediaUrl}
            alt={post?.caption || "Post preview"}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e1f30 0%, #11121a 100%)',
            color: isVideo ? '#a78bfa' : '#94a3b8'
          }}>
            {isVideo ? <Film size={22} /> : <ImageIcon size={22} />}
          </div>
        )}
      </div>
    );
  }

  // Variant: 'card' (Ready to Setup dashboard cards)
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1.2',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#101017',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {mediaUrl && !hasError ? (
        <img
          src={mediaUrl}
          alt={post?.caption || "Post Preview"}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 50% 40%, rgba(30, 32, 54, 0.95) 0%, rgba(13, 14, 22, 0.98) 100%)',
            padding: '16px',
            textAlign: 'center',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: isVideo
              ? 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0) 70%)'
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0) 70%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
          }}>
            {isVideo ? (
              <Film size={28} color="#a78bfa" style={{ filter: 'drop-shadow(0 2px 8px rgba(167, 139, 250, 0.4))' }} />
            ) : (
              <ImageIcon size={28} color="#60a5fa" style={{ filter: 'drop-shadow(0 2px 8px rgba(96, 165, 250, 0.4))' }} />
            )}
          </div>

          <span style={{
            fontSize: '0.78rem',
            fontWeight: '600',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: isVideo ? '#c4b5fd' : '#93c5fd',
            marginBottom: '4px'
          }}>
            {isVideo ? 'Reel / Video' : 'Post Preview'}
          </span>

          <span style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted, #71717a)',
            maxWidth: '180px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {post?.caption || (isFb ? 'Facebook Post' : 'Instagram Post')}
          </span>
        </div>
      )}

      {/* Video / Reel badge on bottom-left if video */}
      {isVideo && (
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          padding: '3px 8px',
          borderRadius: '12px',
          color: 'white',
          fontSize: '0.72rem',
          fontWeight: '600',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Film size={11} /> Reel
        </div>
      )}

      {/* Platform Badge Overlay (Top-Right) */}
      {showBadge && (
        isFb ? (
          <div
            title="Facebook Post"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '24px',
              height: '24px',
              backgroundColor: '#1877f2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <FacebookIcon size={13} />
          </div>
        ) : (
          <div
            title="Instagram Post"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '24px',
              height: '24px',
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <InstagramIcon size={12} />
          </div>
        )
      )}
    </div>
  );
};

const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1';

const COUNTRIES_LIST = [
  "United States",
  "India",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Brazil",
  "United Arab Emirates",
  "Spain",
  "Italy",
  "Mexico",
  "Netherlands",
  "Singapore",
  "Japan",
  "South Africa",
  "Nigeria",
  "Indonesia",
  "Philippines",
  "Pakistan",
  "Bangladesh",
  "Turkey",
  "Saudi Arabia",
  "Sweden",
  "Switzerland",
  "Argentina",
  "Colombia",
  "Egypt",
  "Malaysia",
  "Poland",
  "Thailand",
  "Vietnam",
  "Other"
];




const renderDmText = (text) => {
  if (!text) return '""';
  try {
    let parsed = null;
    if (typeof text === 'object' && text !== null) {
      parsed = text;
    } else {
      const raw = typeof text === 'string' ? text.trim() : String(text);
      if (raw.startsWith('{') && raw.endsWith('}')) {
        parsed = JSON.parse(raw);
      }
    }
    if (parsed) {
      const mainText = parsed.text || parsed.reply_text || parsed.title || parsed.message || '';
      if (parsed.dm_type === 'follow_gate' || parsed.require_follow) {
        const btn = parsed.button_text ? ` [Button: "${parsed.button_text}"]` : '';
        const followBtn = parsed.follow_button_text ? ` [Follow: "${parsed.follow_button_text}"]` : '';
        return `[Follow Gate] "${mainText}"${btn}${followBtn}`;
      }
      if (parsed.dm_type === 'button_template') {
        const btn = parsed.button_text ? ` [Button: "${parsed.button_text}"]` : '';
        return `[Button Template] "${mainText}"${btn}`;
      }
      if (parsed.dm_type === 'image') {
        return `[Image Template] "${mainText}"`;
      }
      if (mainText) {
        return `"${mainText}"`;
      }
    }
  } catch (e) { }
  return `"${text}"`;
};

const renderActionResponseCell = (replyLog, dmLog, tagLog) => {
  if (!replyLog && !dmLog && !tagLog) {
    return <span style={{ color: 'var(--text-muted)' }}>None</span>;
  }

  let dmParsed = null;
  let dmMainText = '';
  if (dmLog?.details?.text) {
    try {
      if (typeof dmLog.details.text === 'object' && dmLog.details.text !== null) {
        dmParsed = dmLog.details.text;
        dmMainText = dmParsed.text || dmParsed.reply_text || dmParsed.title || dmParsed.message || '';
      } else {
        const raw = String(dmLog.details.text).trim();
        if (raw.startsWith('{') && raw.endsWith('}')) {
          dmParsed = JSON.parse(raw);
          dmMainText = dmParsed.text || dmParsed.reply_text || dmParsed.title || dmParsed.message || '';
        } else {
          dmMainText = raw;
        }
      }
    } catch (e) {
      dmMainText = String(dmLog.details.text);
    }
  } else if (dmLog?.details) {
    if (dmLog.details.dm_type || dmLog.details.button_text || dmLog.details.require_follow) {
      dmParsed = dmLog.details;
      dmMainText = dmParsed.text || dmParsed.reply_text || dmParsed.title || dmParsed.message || '';
    }
  }

  if (dmMainText && typeof dmMainText === 'string' && dmMainText.trim().startsWith('{')) {
    try {
      const p = JSON.parse(dmMainText.trim());
      if (p && typeof p === 'object') {
        dmParsed = p;
        dmMainText = p.text || p.reply_text || p.title || p.message || 'Direct Message';
      }
    } catch (e) { }
  }

  return (
    <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {replyLog && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ color: '#94a3b8' }}>💬 Reply:</span>
            <span style={{ color: '#f8fafc', fontWeight: '600' }}>"{replyLog.details?.text || ''}"</span>
            <span className={`badge ${replyLog.status === 'success' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
              {replyLog.status === 'success' ? 'Sent' : 'Failed'}
            </span>
          </div>
          {replyLog.details?.error && (
            <span style={{ fontSize: '0.7rem', color: 'var(--error)' }}>
              Error: {replyLog.details.error}
            </span>
          )}
        </div>
      )}

      {dmLog && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ color: '#94a3b8' }}>✉️ DM:</span>
            <span style={{ color: '#f8fafc', fontWeight: '600' }}>"{dmMainText}"</span>
            <span className={`badge ${dmLog.status === 'success' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
              {dmLog.status === 'success' ? 'Sent' : 'Failed'}
            </span>
          </div>
          {dmLog.details?.error && (
            <span style={{ fontSize: '0.7rem', color: 'var(--error)' }}>
              Error: {dmLog.details.error}
            </span>
          )}

          {/* Clean metadata pills instead of raw JSON dump */}
          {dmParsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
              {(dmParsed.dm_type === 'follow_gate' || dmParsed.require_follow) && (
                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                  color: '#c084fc',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  fontWeight: '600'
                }}>
                  🔒 Follow Gate
                </span>
              )}
              {dmParsed.button_text && (
                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  fontWeight: '600'
                }}>
                  🔘 Button: {dmParsed.button_text}
                </span>
              )}
              {dmParsed.follow_button_text && (
                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(236, 72, 153, 0.15)',
                  color: '#f472b6',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  fontWeight: '600'
                }}>
                  👤 {dmParsed.follow_button_text}
                </span>
              )}
              {dmParsed.image_url && (
                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  color: '#4ade80',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  fontWeight: '600'
                }}>
                  🖼️ Image Attached
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {tagLog && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#94a3b8' }}>🏷️ Tag:</span>
          <span className="keyword-tag">{tagLog.details?.tag}</span>
        </div>
      )}
    </div>
  );
};

const renderActionTypeBadge = (actionType) => {
  const map = {
    dm_sent: { label: 'DM Sent', bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' },
    reply_sent: { label: 'Reply Sent', bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
    trigger_match: { label: 'Trigger Match', bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
    tag_added: { label: 'Tag Added', bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
    condition_check: { label: 'Condition Check', bg: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' }
  };
  const item = map[actionType] || {
    label: actionType ? actionType.replace(/_/g, ' ').toUpperCase() : 'UNKNOWN',
    bg: 'rgba(255, 255, 255, 0.08)',
    color: '#cbd5e1',
    border: 'rgba(255, 255, 255, 0.15)'
  };
  return (
    <span style={{
      fontSize: '0.72rem',
      padding: '3px 8px',
      borderRadius: '6px',
      backgroundColor: item.bg,
      color: item.color,
      border: `1px solid ${item.border}`,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      display: 'inline-block'
    }}>
      {item.label}
    </span>
  );
};

const renderExecutionLogDetails = (log) => {
  if (!log) return null;

  if (log.action_type === 'reply_sent') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ color: '#94a3b8' }}>💬 Reply:</span>
          <span style={{ color: '#f8fafc', fontWeight: '600' }}>"{log.details?.text || ''}"</span>
        </div>
        {log.details?.error && (
          <p style={{ margin: '2px 0 0 0', color: 'var(--error)', fontSize: '0.75rem' }}>
            Error: {log.details.error}
          </p>
        )}
      </div>
    );
  }

  if (log.action_type === 'dm_sent') {
    let dmParsed = null;
    let dmMainText = '';
    if (log.details?.text) {
      try {
        if (typeof log.details.text === 'object' && log.details.text !== null) {
          dmParsed = log.details.text;
          dmMainText = dmParsed.text || dmParsed.reply_text || dmParsed.title || dmParsed.message || '';
        } else {
          const raw = String(log.details.text).trim();
          if (raw.startsWith('{') && raw.endsWith('}')) {
            dmParsed = JSON.parse(raw);
            dmMainText = dmParsed.text || dmParsed.reply_text || dmParsed.title || dmParsed.message || '';
          } else {
            dmMainText = raw;
          }
        }
      } catch (e) {
        dmMainText = String(log.details.text);
      }
    } else if (log.details) {
      if (log.details.dm_type || log.details.button_text || log.details.require_follow) {
        dmParsed = log.details;
        dmMainText = dmParsed.text || dmParsed.reply_text || dmParsed.title || dmParsed.message || '';
      }
    }

    if (dmMainText && typeof dmMainText === 'string' && dmMainText.trim().startsWith('{')) {
      try {
        const p = JSON.parse(dmMainText.trim());
        if (p && typeof p === 'object') {
          dmParsed = p;
          dmMainText = p.text || p.reply_text || p.title || p.message || 'Direct Message';
        }
      } catch (e) { }
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ color: '#94a3b8' }}>✉️ DM:</span>
          <span style={{ color: '#f8fafc', fontWeight: '600' }}>"{dmMainText || 'Direct Message'}"</span>
        </div>

        {dmParsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
            {(dmParsed.dm_type === 'follow_gate' || dmParsed.require_follow) && (
              <span style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                color: '#c084fc',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                fontWeight: '600'
              }}>
                🔒 Follow Gate
              </span>
            )}
            {dmParsed.button_text && (
              <span style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                fontWeight: '600'
              }}>
                🔘 Button: {dmParsed.button_text}
              </span>
            )}
            {dmParsed.follow_button_text && (
              <span style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(236, 72, 153, 0.15)',
                color: '#f472b6',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                fontWeight: '600'
              }}>
                👤 {dmParsed.follow_button_text}
              </span>
            )}
            {dmParsed.image_url && (
              <span style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                fontWeight: '600'
              }}>
                🖼️ Image Attached
              </span>
            )}
          </div>
        )}

        {log.details?.error && (
          <p style={{ margin: '2px 0 0 0', color: 'var(--error)', fontSize: '0.75rem' }}>
            Error: {log.details.error}
          </p>
        )}
      </div>
    );
  }

  if (log.action_type === 'tag_added') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#94a3b8' }}>🏷️ Tag:</span>
        <span className="keyword-tag">{log.details?.tag}</span>
      </div>
    );
  }

  if (log.action_type === 'trigger_match') {
    const keywords = log.details?.matched_keywords;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ color: '#94a3b8' }}>🎯 Trigger:</span>
          {Array.isArray(keywords) && keywords.length > 0 ? (
            keywords.map((kw, i) => (
              <span key={i} className="keyword-tag" style={{ fontSize: '0.72rem' }}>{kw}</span>
            ))
          ) : (
            <span className="keyword-tag" style={{ fontSize: '0.72rem' }}>{log.details?.comment_text || 'Matched'}</span>
          )}
        </div>
        {log.details?.comment_text && (
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Comment: "{log.details.comment_text}"
          </span>
        )}
      </div>
    );
  }

  if (log.action_type === 'condition_check') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#94a3b8' }}>⚙️ Condition:</span>
          <span style={{ color: '#f8fafc', fontWeight: '500' }}>
            {log.details?.field} ({log.details?.operator})
          </span>
          <span className={`badge ${log.details?.matched ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
            {log.details?.matched ? 'Passed' : 'Failed'}
          </span>
        </div>
        {log.details?.expected !== undefined && (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Expected: {String(log.details.expected)}
          </span>
        )}
      </div>
    );
  }

  return (
    <pre style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'monospace', margin: 0 }}>
      {JSON.stringify(log.details)}
    </pre>
  );
};

const ensureAbsoluteUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const cleanFollowButtonText = (val) => {
  if (!val) return 'Follow Me';
  const str = String(val).trim();
  const cleaned = str.replace(/\bhere\b/gi, '').replace(/\s+/g, ' ').trim();
  if (!cleaned || cleaned.toLowerCase() === 'follow me' || cleaned.toLowerCase() === 'follow') {
    return 'Follow Me';
  }
  return cleaned;
};

const cleanDmReplyText = (replyText) => {
  if (!replyText || typeof replyText !== 'string') return replyText;
  try {
    const stripped = replyText.trim();
    if (stripped.startsWith('{') && stripped.endsWith('}')) {
      const parsed = JSON.parse(stripped);
      let changed = false;
      if (parsed.follow_button_text && parsed.follow_button_text.toLowerCase().includes('here')) {
        parsed.follow_button_text = cleanFollowButtonText(parsed.follow_button_text);
        changed = true;
      }
      return changed ? JSON.stringify(parsed) : replyText;
    }
  } catch (e) { }
  return replyText;
};

export default function App() {
  const formatDateIST = (rawVal) => {
    let val = rawVal;
    if (val && typeof val === 'object' && !(val instanceof Date)) {
      val = val.timestamp || val.created_time || val.created_at || val.date;
    }
    if (!val) return 'N/A';

    let d;
    if (val instanceof Date) {
      d = val;
    } else if (typeof val === 'number') {
      d = new Date(val < 1e11 ? val * 1000 : val);
    } else if (typeof val === 'string' && /^\d+$/.test(val.trim())) {
      const num = Number(val.trim());
      d = new Date(num < 1e11 ? num * 1000 : num);
    } else {
      let strVal = String(val).trim();
      // Meta Graph API returns ISO timestamps in UTC. If string lacks timezone offset (e.g. 'Z' or '+00:00'), append 'Z' so JS parses as UTC.
      if (!strVal.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(strVal)) {
        strVal += 'Z';
      }
      d = new Date(strVal);
    }

    if (!d || isNaN(d.getTime()) || d.getFullYear() <= 1970) return 'N/A';
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    }) + ' (IST)';
  };

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('shantidm_active_tab') || 'dashboard';
  });
  const [isInitialLoading, setIsInitialLoading] = useState(() => {
    const hasToken = !!localStorage.getItem('authToken');
    const hasCached = !!localStorage.getItem('shantidm_cached_accounts') || !!localStorage.getItem('shantidm_cached_fb_accounts');
    return hasToken && !hasCached;
  });
  const [demoMode, setDemoMode] = useState(false);

  const [runningFlowId, setRunningFlowId] = useState(null);
  const [scanningFlowId, setScanningFlowId] = useState(null);
  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideTab, setGuideTab] = useState('post_flow');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [authMode, setAuthMode] = useState('login');

  // Automatically save activeTab changes to localStorage so page refresh preserves current view
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('shantidm_active_tab', activeTab);
    }
  }, [activeTab]);

  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Registration form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [country, setCountry] = useState('');
  const [accountType, setAccountType] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');

  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || 'admin@insta-automator.com');
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  const [metaScopes, setMetaScopes] = useState('instagram_basic,instagram_manage_comments,pages_show_list,pages_read_engagement,instagram_manage_messages,pages_messaging');

  // Data States - Cached in localStorage to prevent flashing unconnected state on page refresh
  const [accounts, setAccounts] = useState(() => {
    try {
      const cached = localStorage.getItem('shantidm_cached_accounts');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [facebookAccounts, setFacebookAccounts] = useState(() => {
    try {
      const cached = localStorage.getItem('shantidm_cached_fb_accounts');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [posts, setPosts] = useState([]);
  const [skippedPostIds, setSkippedPostIds] = useState([]);
  const [postsFilterStatus, setPostsFilterStatus] = useState('All');
  const [postsSearchQuery, setPostsSearchQuery] = useState('');

  // Meta Connection Status & Diagnostics
  // Values: 'not_connected' | 'connected' | 'failed' | 'action_required'
  const [metaConnectionStatus, setMetaConnectionStatus] = useState('not_connected');
  const [metaErrorMessage, setMetaErrorMessage] = useState('');
  const [metaErrorDetails, setMetaErrorDetails] = useState('');
  const [metaErrorType, setMetaErrorType] = useState('');
  const [showSetupGuideAlways, setShowSetupGuideAlways] = useState(false);

  const hasConnectedAccount = Boolean((accounts && accounts.length > 0) || (facebookAccounts && facebookAccounts.length > 0));

  // Sync connection status with account state unless an explicit error or action requirement is active
  useEffect(() => {
    if (hasConnectedAccount) {
      setMetaConnectionStatus(prev => (prev === 'failed' || prev === 'action_required' ? prev : 'connected'));
    } else {
      setMetaConnectionStatus(prev => (prev === 'failed' || prev === 'action_required' ? prev : 'not_connected'));
    }
  }, [accounts, facebookAccounts, hasConnectedAccount]);

  // Synchronize accounts cache in localStorage to eliminate blink/flash on page refresh
  useEffect(() => {
    try {
      if (accounts && accounts.length > 0) {
        localStorage.setItem('shantidm_cached_accounts', JSON.stringify(accounts));
      } else if (isAuthenticated && !isInitialLoading) {
        localStorage.removeItem('shantidm_cached_accounts');
      }
    } catch (_) { }
  }, [accounts, isAuthenticated, isInitialLoading]);

  useEffect(() => {
    try {
      if (facebookAccounts && facebookAccounts.length > 0) {
        localStorage.setItem('shantidm_cached_fb_accounts', JSON.stringify(facebookAccounts));
      } else if (isAuthenticated && !isInitialLoading) {
        localStorage.removeItem('shantidm_cached_fb_accounts');
      }
    } catch (_) { }
  }, [facebookAccounts, isAuthenticated, isInitialLoading]);

  const getRelativeTime = (rawVal) => {
    let val = rawVal;
    if (val && typeof val === 'object' && !(val instanceof Date)) {
      val = val.timestamp || val.created_time || val.created_at || val.date;
    }
    if (!val) return 'N/A';

    let date;
    if (val instanceof Date) {
      date = val;
    } else if (typeof val === 'number') {
      date = new Date(val < 1e11 ? val * 1000 : val);
    } else if (typeof val === 'string' && /^\d+$/.test(val.trim())) {
      const num = Number(val.trim());
      date = new Date(num < 1e11 ? num * 1000 : num);
    } else {
      date = new Date(val);
    }

    if (!date || isNaN(date.getTime()) || date.getFullYear() <= 1970) return 'N/A';
    const now = new Date();
    const diffTime = Math.abs(now - date);
    if (diffTime < 60 * 1000) return 'Just now';
    if (diffTime < 60 * 60 * 1000) {
      const mins = Math.floor(diffTime / 60000);
      return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;
    }
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
  };

  const getFlowForPost = (post) => {
    if (!post) return null;
    const isFb = checkIsFbPost(post);
    const postIdStr = String(post.id);
    // 1. Direct post flow
    let flow = flows.find(f => isFb ? String(f.facebook_post_id) === postIdStr : String(f.instagram_post_id) === postIdStr);
    if (flow) return flow;

    // 2. Future flow covering all future posts
    const postTime = post.timestamp ? new Date(post.timestamp).getTime() : null;
    flow = flows.find(f => {
      if (!f.is_active || !f.is_future_flow || !f.apply_to_all_future_posts) return false;
      const accMatch = isFb
        ? (f.facebook_account_id && String(f.facebook_account_id) === String(post.facebook_account_id))
        : (f.instagram_account_id && String(f.instagram_account_id) === String(post.instagram_account_id));
      if (!accMatch) return false;
      if (postTime && f.created_at) {
        const flowTime = new Date(f.created_at).getTime();
        return postTime >= (flowTime - 3600000);
      }
      return true;
    });
    return flow || null;
  };

  const getPostStatus = (post) => {
    if (!post) return 'Setup';
    const flow = getFlowForPost(post);
    if (flow) {
      return flow.is_active ? 'Active' : 'Paused';
    }
    const hasDirect = Boolean(post.keyword && (post.reply_message || post.dm_message));
    if (hasDirect) {
      return post.automation_status === 'paused' ? 'Paused' : 'Active';
    }
    return 'Setup';
  };

  const getPostStats = (post) => {
    if (!post) return { sent: 0, open: 0, clicks: 0, ctr: '0%' };
    const status = getPostStatus(post);
    if (status === 'Setup') {
      return { sent: 0, open: 0, clicks: 0, ctr: '-' };
    }

    const postIdStr = String(post.id);

    // Gather all logs corresponding to this specific post ID
    const postLogs = (logs || []).filter(log => {
      const comment = (comments || []).find(c => String(c.comment_id) === String(log.comment_id));
      if (comment && (String(comment.media_id) === postIdStr || String(comment.post_id) === postIdStr)) {
        return true;
      }
      if (String(log.details?.media_id) === postIdStr || String(log.details?.post_id) === postIdStr) {
        return true;
      }
      if (log.flow_id) {
        const flow = (flows || []).find(f => f.id === log.flow_id);
        if (flow && (String(flow.instagram_post_id) === postIdStr || String(flow.facebook_post_id) === postIdStr)) {
          return true;
        }
      }
      return false;
    });

    // Count actual comments belonging to this post that were processed
    const postComments = (comments || []).filter(c => String(c.media_id) === postIdStr || String(c.post_id) === postIdStr);
    const processedComments = postComments.filter(c => c.processed || c.ai_replied || c.status === 'replied');

    // SENT: Real count of sent actions (DMs + public replies) from logs or processed comments count
    const dmsSentLogs = postLogs.filter(l =>
      (l.action_type === 'dm_sent' || l.action_type === 'DM_SENT' || l.action_type === 'DM_REPLY') &&
      (l.status === 'success' || l.status === 'Success')
    ).length;
    const repliesSentLogs = postLogs.filter(l =>
      (l.action_type === 'reply_sent' || l.action_type === 'REPLY_SENT' || l.action_type === 'PUBLIC_REPLY') &&
      (l.status === 'success' || l.status === 'Success')
    ).length;
    const totalSuccessfulLogs = postLogs.filter(l => l.status === 'success' || l.status === 'Success').length;

    const sent = Math.max(dmsSentLogs + repliesSentLogs, totalSuccessfulLogs, processedComments.length);

    // OPEN: Delivered/Opened DMs or replies
    const open = Math.min(sent, postLogs.filter(l => l.status === 'success' || l.status === 'Success').length || sent);

    // CLICKS: Tracked link clicks / interaction triggers
    const clicks = postLogs.filter(l =>
      l.action_type === 'link_clicked' ||
      l.action_type === 'LINK_CLICKED' ||
      l.action_type === 'click' ||
      l.action_type === 'CLICK' ||
      l.details?.clicked ||
      l.details?.link_clicked
    ).length;

    // CTR: Calculated Click-Through Rate
    const ctrVal = sent > 0 ? Math.round((clicks / sent) * 100) : 0;

    return {
      sent,
      open,
      clicks,
      ctr: sent > 0 ? `${ctrVal}%` : '0%'
    };
  };

  const handleTogglePostAutomation = async (post) => {
    if (!post) return;
    const isFb = checkIsFbPost(post);
    const flow = getFlowForPost(post);

    if (flow) {
      const updatedFlow = { ...flow, is_active: !flow.is_active };
      if (demoMode) {
        setFlows(prev => prev.map(f => f.id === flow.id ? updatedFlow : f));
        addToast(`Automation ${updatedFlow.is_active ? 'resumed' : 'paused'} (Mock)`, "success");
      } else {
        try {
          const res = await fetch(`${API_BASE}/automation/${flow.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payloadForFlow(updatedFlow))
          });
          if (res.ok) {
            addToast(`Automation ${updatedFlow.is_active ? 'resumed' : 'paused'}!`, "success");
            setFlows(prev => prev.map(f => f.id === flow.id ? updatedFlow : f));
          } else {
            addToast("Failed to toggle automation.", "error");
          }
        } catch (err) {
          console.error(err);
          addToast("Connection error.", "error");
        }
      }
      return; // Stop here: the flow controls the automation state.
      const currentStatus = getPostStatus(post).toLowerCase();
      if (currentStatus === 'setup') {
        addToast("Please set up an automation flow or response rule first.", "info");
        return;
      }
      const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
      const updatedPost = { ...post, automation_status: nextStatus };

      if (demoMode) {
        if (isFb) {
          setFacebookPosts(prev => prev.map(p => p.id === post.id ? updatedPost : p));
        } else {
          setPosts(prev => prev.map(p => p.id === post.id ? updatedPost : p));
        }
        addToast(`Automation ${nextStatus === 'active' ? 'resumed' : 'paused'} (Mock)`, "success");
      } else {
        try {
          const url = isFb ? `${API_BASE}/posts/facebook/${post.id}/automation` : `${API_BASE}/posts/${post.id}/automation`;
          const res = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              automation_status: nextStatus,
              keyword: post.keyword || "",
              reply_message: post.reply_message || "",
              dm_message: post.dm_message || ""
            })
          });
          if (res.ok) {
            addToast(`Automation ${nextStatus === 'active' ? 'resumed' : 'paused'}!`, "success");
            if (isFb) {
              setFacebookPosts(prev => prev.map(p => p.id === post.id ? updatedPost : p));
            } else {
              setPosts(prev => prev.map(p => p.id === post.id ? updatedPost : p));
            }
          } else {
            addToast("Failed to toggle automation.", "error");
          }
        } catch (err) {
          console.error(err);
          addToast("Connection error.", "error");
        }
      }
    }
  };

  const payloadForFlow = (flow) => {
    return {
      instagram_account_id: flow.instagram_account_id,
      facebook_account_id: flow.facebook_account_id,
      instagram_post_id: flow.instagram_post_id || null,
      facebook_post_id: flow.facebook_post_id || null,
      name: flow.name,
      is_active: flow.is_active,
      nodes: flow.nodes,
      edges: flow.edges
    };
  };

  const getFlowLinkedPost = (flow) => {
    if (!flow) return null;
    let isFb = !!flow.facebook_post_id;
    let postId = isFb ? flow.facebook_post_id : flow.instagram_post_id;

    if (!postId && flow.nodes) {
      const triggerNode = flow.nodes.find(n => n.type === 'trigger');
      if (triggerNode?.config?.post_id) {
        postId = triggerNode.config.post_id;
        isFb = !!triggerNode.config.is_facebook;
      }
    }

    let matchedPost = null;
    if (postId) {
      const postIdStr = String(postId);
      matchedPost = isFb
        ? facebookPosts.find(p => String(p.id) === postIdStr || String(p.facebook_post_id) === postIdStr)
        : posts.find(p => String(p.id) === postIdStr || String(p.instagram_post_id) === postIdStr);
    } else if (flow.name && flow.name.startsWith("Post Flow: ")) {
      const titleSnippet = flow.name.replace("Post Flow: ", "").trim().toLowerCase();
      matchedPost = posts.find(p => {
        const pid = String(p.id).toLowerCase();
        return pid === titleSnippet || titleSnippet.includes(pid) || (p.caption && p.caption.toLowerCase().includes(titleSnippet));
      }) || facebookPosts.find(p => {
        const pid = String(p.id).toLowerCase();
        return pid === titleSnippet || titleSnippet.includes(pid) || ((p.caption || p.message || '').toLowerCase().includes(titleSnippet));
      });
      if (matchedPost) {
        postId = matchedPost.id;
        isFb = !!matchedPost.facebook_account_id;
      }
    }

    if (!postId && !matchedPost) return null;

    const postIdStr = String(postId || matchedPost?.id);
    const matchedInsta = accounts.find(a => a.id === flow.instagram_account_id);
    const matchedFb = facebookAccounts.find(a => a.id === flow.facebook_account_id);
    const platformName = (isFb || flow.facebook_account_id) ? "Facebook" : "Instagram";
    const accountName = matchedFb ? matchedFb.name : matchedInsta ? `@${matchedInsta.username}` : "Connected Channel";

    const mediaUrl = matchedPost?.media_url || matchedPost?.thumbnail_url || matchedPost?.full_picture || null;

    let caption = matchedPost?.caption || matchedPost?.message || null;
    if (!caption && flow.name) {
      if (flow.name.startsWith("Post Flow: ")) {
        caption = flow.name.replace("Post Flow: ", "");
      } else {
        caption = flow.name;
      }
    }

    const permalink = matchedPost?.permalink || matchedPost?.permalink_url || (isFb ? null : `https://www.instagram.com/p/${postIdStr}/`);
    const timestamp = matchedPost?.timestamp || matchedPost?.created_time || matchedPost?.created_at || null;

    return {
      postId: postIdStr,
      isFb,
      platformName,
      accountName,
      matchedPost: matchedPost || null,
      mediaUrl,
      caption: caption || `Post ${postIdStr}`,
      permalink,
      timestamp,
      flow
    };
  };

  const handleOpenPostOnPlatform = (linkedPostInfo) => {
    if (!linkedPostInfo) return;
    const postToOpen = linkedPostInfo.matchedPost || {
      id: linkedPostInfo.postId,
      caption: linkedPostInfo.caption || `Post ${linkedPostInfo.postId}`,
      media_url: linkedPostInfo.mediaUrl,
      thumbnail_url: linkedPostInfo.mediaUrl,
      permalink: linkedPostInfo.permalink,
      timestamp: linkedPostInfo.timestamp,
      facebook_account_id: linkedPostInfo.isFb ? (linkedPostInfo.flow?.facebook_account_id || null) : null,
      instagram_account_id: !linkedPostInfo.isFb ? (linkedPostInfo.flow?.instagram_account_id || null) : null
    };
    handleOpenComments(postToOpen);
  };

  const handleRemovePostAutomation = async (post) => {
    if (!post) return;
    const isFb = checkIsFbPost(post);
    const postIdStr = String(post.id);
    const flow = flows.find(f => isFb ? String(f.facebook_post_id) === postIdStr : String(f.instagram_post_id) === postIdStr);

    const updatedPost = {
      ...post,
      automation_status: 'setup',
      keyword: null,
      reply_message: null,
      dm_message: null
    };

    if (demoMode) {
      if (flow) {
        setFlows(prev => prev.filter(f => f.id !== flow.id));
      }
      if (isFb) {
        setFacebookPosts(prev => prev.map(p => String(p.id) === postIdStr ? updatedPost : p));
      } else {
        setPosts(prev => prev.map(p => String(p.id) === postIdStr ? updatedPost : p));
      }
      addToast("Automation removed (Mock)", "success");
      return;
    }

    try {
      if (flow) {
        await fetch(`${API_BASE}/automation/${flow.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      const url = isFb ? `${API_BASE}/posts/facebook/${post.id}/automation` : `${API_BASE}/posts/${post.id}/automation`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          automation_status: 'setup',
          keyword: "",
          reply_message: "",
          dm_message: ""
        })
      });

      if (res.ok || flow) {
        addToast("Automation removed successfully!", "success");
        if (flow) {
          setFlows(prev => prev.filter(f => f.id !== flow.id));
        }
        if (isFb) {
          setFacebookPosts(prev => prev.map(p => String(p.id) === postIdStr ? updatedPost : p));
        } else {
          setPosts(prev => prev.map(p => String(p.id) === postIdStr ? updatedPost : p));
        }
        fetchBackendData();
      } else {
        addToast("Failed to remove automation.", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Connection error while removing automation.", "error");
    }
  };

  const [facebookPosts, setFacebookPosts] = useState([]);
  const [flows, setFlows] = useState([]);
  const [comments, setComments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [postsFilterPlatform, setPostsFilterPlatform] = useState("instagram");
  const [selectedInstagramAccount, setSelectedInstagramAccount] = useState("all");
  const [selectedFacebookAccount, setSelectedFacebookAccount] = useState("all");
  const [analytics, setAnalytics] = useState({
    total_comments: 0,
    replies_sent: 0,
    dms_sent: 0,
    failed_replies: 0,
    avg_response_time_seconds: 0.0,
    keyword_counts: {}
  });

  const [dmRules, setDmRules] = useState([]);
  const [dmMessages, setDmMessages] = useState([]);
  const [dmConversations, setDmConversations] = useState([]);
  const [dmExecutions, setDmExecutions] = useState([]);
  const [isDmsLoading, setIsDmsLoading] = useState(false);
  const [isDmsSaving, setIsDmsSaving] = useState(false);
  const [dmSubTab, setDmSubTab] = useState('rules');

  // DM Rule Form states
  const [editingDmRule, setEditingDmRule] = useState(null);
  const [showDmModal, setShowDmModal] = useState(false);
  const [deleteConfirmRuleId, setDeleteConfirmRuleId] = useState(null);
  const [deleteConfirmFlowId, setDeleteConfirmFlowId] = useState(null);
  const [previewDmRule, setPreviewDmRule] = useState(null);
  const [modalTab, setModalTab] = useState('dm_setup'); // 'dm_setup', 'trigger_setup', 'settings'
  const [previewStep, setPreviewStep] = useState(1); // 1 = locked initial, 2 = early click warning, 3 = unlocked
  const [dmRuleForm, setDmRuleForm] = useState({
    instagram_account_id: '',
    name: 'Draft #1',
    trigger_type: 'any_message',
    keyword: '',
    reply_text: 'Welcome! Click the link below to get started.',
    is_active: true,
    dm_type: 'button_template',
    title: '',
    subtitle: '',
    button_text: 'Download Guide',
    button_url: 'https://fitlife.co/shop',
    image_url: '',
    require_follow: false,
    follow_intro_text: '',
    follow_url: '',
    follow_button_text: 'Follow Me',
    confirm_button_text: "I'm Following",
    final_link_url: '',
    final_dm_text: ''
  });
  const [isUploadingDmImage, setIsUploadingDmImage] = useState(false);
  const dmImageFileInputRef = useRef(null);



  // Flow Builder states
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [builderNodes, setBuilderNodes] = useState([]);
  const [builderEdges, setBuilderEdges] = useState([]);

  // UI helper states
  const [toasts, setToasts] = useState([]);
  const [isConnectingFB, setIsConnectingFB] = useState(false);
  const [isSyncingPosts, setIsSyncingPosts] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [postsFilter, setPostsFilter] = useState("all"); // "all", "posts", "reels"
  const [postsAutomationFilter, setPostsAutomationFilter] = useState("all"); // "all", "active", "setup", "paused"
  const [selectedLogPostId, setSelectedLogPostId] = useState("all"); // "all" or specific post ID
  const [isLogPostPickerOpen, setIsLogPostPickerOpen] = useState(false);
  const [logPostSearchTerm, setLogPostSearchTerm] = useState("");
  const [logPostFilterTab, setLogPostFilterTab] = useState("activity"); // "activity" (only posts with logs/flows) or "all"
  const [showFuturePostModal, setShowFuturePostModal] = useState(false);
  const [futurePostForm, setFuturePostForm] = useState({
    instagram_account_id: '',
    facebook_account_id: '',
    caption: '',
    media_type: 'IMAGE',
    media_url: '',
    keyword: '',
    reply_message: '',
    dm_message: ''
  });
  const [showConfigureAutomationModal, setShowConfigureAutomationModal] = useState(false);
  const [selectedPostForAutomation, setSelectedPostForAutomation] = useState(null);
  const [automationForm, setAutomationForm] = useState({
    automation_status: 'setup',
    keyword: '',
    reply_message: '',
    dm_message: ''
  });
  const [showConnectModal, setShowConnectModal] = useState(false);

  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'danger'
  });

  const requestConfirmation = ({ title, message, onConfirm, confirmText = 'Confirm', variant = 'danger' }) => {
    setConfirmModalState({
      isOpen: true,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText: 'Cancel',
      variant
    });
  };

  // Post Comments Modal state
  const [activeCommentsPost, setActiveCommentsPost] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [newReplyText, setNewReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Safe navigation interceptor: ensures new users must link a Meta account before entering other sections
  const handleNavigateTab = (targetTab) => {
    if (targetTab !== 'accounts' && !hasConnectedAccount) {
      addToast("Connect Meta to unlock this", "info");
      setActiveTab('accounts');
      return;
    }
    setActiveTab(targetTab);
  };

  // Automatically keep unlinked users on the Linked Accounts setup hub
  useEffect(() => {
    if (!isInitialLoading && isAuthenticated && !hasConnectedAccount && activeTab !== 'accounts') {
      setActiveTab('accounts');
    }
  }, [hasConnectedAccount, activeTab, isAuthenticated, isInitialLoading]);

  // Auto-authenticate & fetch on start
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          await fetchBackendData(storedToken);
        } catch (err) {
          console.warn("Stored token validation failed:", err);
        } finally {
          setIsInitialLoading(false);
        }
      } else {
        checkBackendHealth();
        setIsInitialLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // Fetch Meta config and initialize FB SDK
  useEffect(() => {
    const initFacebookSDK = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/meta-config`);
        if (res.ok) {
          const config = await res.json();
          if (config.app_id) {
            if (config.scopes) {
              const cleanedScopes = String(config.scopes)
                .replace(/[;.\s]+/g, ',')
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
                .join(',');
              setMetaScopes(cleanedScopes || config.scopes);
            }
            window.fbAsyncInit = function () {
              window.FB.init({
                appId: config.app_id,
                cookie: true,
                xfbml: true,
                version: 'v19.0'
              });
            };

            // Load Facebook SDK script
            (function (d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = "https://connect.facebook.net/en_US/sdk.js";
              if (fjs && fjs.parentNode) {
                fjs.parentNode.insertBefore(js, fjs);
              } else {
                (d.head || d.body).appendChild(js);
              }
            }(document, 'script', 'facebook-jssdk'));
          }
        }
      } catch (err) {
        console.warn("Failed to load Meta App Configuration for SDK:", err);
      }
    };

    if (isAuthenticated && !demoMode) {
      initFacebookSDK();
    }
  }, [isAuthenticated, demoMode]);

  const checkBackendHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/meta-config`);
      if (res.ok) {
        // Backend is online
        addToast("Connected to FastAPI Automation Backend.", "success");
      } else {
        throw new Error("Offline");
      }
    } catch (err) {
      addToast("FastAPI Database offline or connection refused. Please start backend services.", "error");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      addToast("Please provide both email and password.", "warning");
      return;
    }
    setLoginLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login-json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (res.ok) {
        const data = await res.json();
        const authToken = data.access_token;
        setToken(authToken);
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userEmail', loginEmail);
        setUserEmail(loginEmail);

        // Pre-fetch connected accounts BEFORE rendering authenticated workspace to avoid flashing setup screen
        let hasAccounts = false;
        try {
          const headers = { 'Authorization': `Bearer ${authToken}` };
          const [accRes, fbAccRes] = await Promise.all([
            fetch(`${API_BASE}/accounts`, { headers }),
            fetch(`${API_BASE}/accounts/facebook`, { headers })
          ]);
          let fetchedAccs = [];
          let fetchedFb = [];
          if (accRes.ok) {
            fetchedAccs = await accRes.json();
            setAccounts(fetchedAccs);
            if (fetchedAccs.length > 0) {
              localStorage.setItem('shantidm_cached_accounts', JSON.stringify(fetchedAccs));
            }
          }
          if (fbAccRes.ok) {
            fetchedFb = await fbAccRes.json();
            setFacebookAccounts(fetchedFb);
            if (fetchedFb.length > 0) {
              localStorage.setItem('shantidm_cached_fb_accounts', JSON.stringify(fetchedFb));
            }
          }
          hasAccounts = Boolean((fetchedAccs && fetchedAccs.length > 0) || (fetchedFb && fetchedFb.length > 0));
        } catch (fetchErr) {
          console.warn("Could not pre-fetch accounts during login:", fetchErr);
        }

        const targetTab = hasAccounts ? 'dashboard' : 'accounts';
        setActiveTab(targetTab);
        localStorage.setItem('shantidm_active_tab', targetTab);

        setIsAuthenticated(true);
        setIsInitialLoading(false);
        addToast("Signed in successfully.", "success");
        // Complete fetching all remaining posts, flows, and DMs in background
        fetchBackendData(authToken);
      } else {
        const err = await res.json();
        addToast(err.detail || "Authentication failed.", "error");
      }
    } catch (err) {
      // Fallback
      setDemoMode(true);
      setIsAuthenticated(true);
      setActiveTab('dashboard');
      loadDemoData();
      addToast("Failed connecting to server. Running in Demo Mode.", "warning");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !regEmail.trim() || !businessName.trim() || !country || !accountType || !regPassword) {
      addToast("Please fill in all registration fields.", "warning");
      return;
    }
    setRegLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: regEmail.trim(),
          business_name: businessName.trim(),
          country: country,
          account_type: accountType,
          password: regPassword
        })
      });
      if (res.ok) {
        const data = await res.json();
        const authToken = data.access_token;
        // Clear any leftover data from a previous session before setting up the new user
        resetAllDataState();
        setAccounts([]);
        setFacebookAccounts([]);
        setToken(authToken);
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userEmail', regEmail);
        setUserEmail(regEmail);
        // New users need to link their Meta account first
        setActiveTab('accounts');
        localStorage.setItem('shantidm_active_tab', 'accounts');
        setIsAuthenticated(true);
        setIsInitialLoading(false);
        addToast(`Welcome to ShantiDM, ${firstName}! Please connect your Meta account to unlock tools.`, "success");
        fetchBackendData(authToken);
      } else {
        const err = await res.json();
        addToast(err.detail || "Registration failed.", "error");
      }
    } catch (err) {
      setDemoMode(true);
      setIsAuthenticated(true);
      setActiveTab('accounts');
      loadDemoData();
      addToast("Server connection error. Activated ShantiDM Demo Account.", "warning");
    } finally {
      setRegLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      addToast("Please enter your email address.", "warning");
      return;
    }
    setForgotLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() })
      });
      const data = await res.json();
      setForgotSuccessMsg(data.message || `Password reset instructions sent to ${forgotEmail}`);
      addToast("Password reset request submitted.", "success");
    } catch (err) {
      setForgotSuccessMsg(`If an account exists for ${forgotEmail}, instructions have been sent.`);
      addToast("Password reset request processed.", "info");
    } finally {
      setForgotLoading(false);
    }
  };

  const resetAllDataState = () => {
    // Wipe every piece of per-user data so a freshly logged-in account
    // never sees data that belonged to a previous session or user.
    setComments([]);
    setLogs([]);
    setFlows([]);
    setPosts([]);
    setFacebookPosts([]);
    setDmRules([]);
    setDmMessages([]);
    setDmConversations([]);
    setDmExecutions([]);
    setAnalytics(null);
  };

  const handleLogout = () => {
    // 1. Immediately drop authentication flag to instantly switch to the Login screen with no blink
    setIsAuthenticated(false);
    setAuthMode('login');
    setIsInitialLoading(false);
    setActiveTab('dashboard');
    setUserEmail('');
    setToken('');
    setAccounts([]);
    setFacebookAccounts([]);
    setDemoMode(false);

    // 2. Clear ALL per-user data state (comments, logs, DM automations, posts, flows, analytics)
    resetAllDataState();

    // 3. Clear all cached state from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('shantidm_active_tab');
    localStorage.removeItem('shantidm_cached_accounts');
    localStorage.removeItem('shantidm_cached_fb_accounts');

    addToast("Logged out successfully.", "info");
  };

  const fetchBackendData = async (authToken = token) => {
    if (!authToken) return;
    const headers = { 'Authorization': `Bearer ${authToken}` };
    try {
      const [
        accRes, fbAccRes, postsRes, fbPostsRes, flowsRes, logsRes, commentsRes, fbCommentsRes, analyticsRes,
        dmRulesRes, dmExecutionsRes
      ] = await Promise.all([
        fetch(`${API_BASE}/accounts`, { headers }),
        fetch(`${API_BASE}/accounts/facebook`, { headers }),
        fetch(`${API_BASE}/posts`, { headers }),
        fetch(`${API_BASE}/posts/facebook`, { headers }),
        fetch(`${API_BASE}/automation`, { headers }),
        fetch(`${API_BASE}/logs`, { headers }),
        fetch(`${API_BASE}/comments`, { headers }),
        fetch(`${API_BASE}/comments/facebook`, { headers }),
        fetch(`${API_BASE}/analytics`, { headers }),
        fetch(`${API_BASE}/dm-automation`, { headers }),
        fetch(`${API_BASE}/dm-automation/executions`, { headers })
      ]);

      if (accRes.status === 401 || fbAccRes.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('shantidm_active_tab');
        localStorage.removeItem('shantidm_cached_accounts');
        localStorage.removeItem('shantidm_cached_fb_accounts');
        setIsAuthenticated(false);
        setToken('');
        setAccounts([]);
        setFacebookAccounts([]);
        addToast("Session expired. Please sign in again.", "warning");
        return;
      }

      // Account parsing is deferred — handled below after both responses are available
      // Determine whether this user has any connected accounts
      const accData = accRes.ok ? (await accRes.json()) : [];
      const fbData = fbAccRes.ok ? (await fbAccRes.json()) : [];

      // Re-set accounts state from the fresh payload (already parsed above)
      setAccounts(accData);
      try {
        if (accData && accData.length > 0) {
          localStorage.setItem('shantidm_cached_accounts', JSON.stringify(accData));
        } else {
          localStorage.removeItem('shantidm_cached_accounts');
        }
      } catch (_) { }
      setFacebookAccounts(fbData);
      try {
        if (fbData && fbData.length > 0) {
          localStorage.setItem('shantidm_cached_fb_accounts', JSON.stringify(fbData));
        } else {
          localStorage.removeItem('shantidm_cached_fb_accounts');
        }
      } catch (_) { }

      const hasNoAccounts = (!accData || accData.length === 0) && (!fbData || fbData.length === 0);

      if (hasNoAccounts) {
        // User has no connected accounts — ensure all data states are empty
        // so nothing from a previous session or another account leaks through.
        resetAllDataState();
        return;
      }

      if (postsRes.ok) setPosts(await postsRes.json());
      if (fbPostsRes.ok) setFacebookPosts(await fbPostsRes.json());
      if (flowsRes.ok) setFlows(await flowsRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      if (dmRulesRes.ok) {
        const rawRules = await dmRulesRes.json();
        setDmRules(rawRules.map(r => ({ ...r, reply_text: cleanDmReplyText(r.reply_text) })));
      }
      if (dmExecutionsRes.ok) setDmExecutions(await dmExecutionsRes.json());

      let igComments = [];
      let fbComments = [];
      if (commentsRes.ok) {
        igComments = (await commentsRes.json()).map(c => ({ ...c, platform: 'instagram' }));
      }
      if (fbCommentsRes && fbCommentsRes.ok) {
        fbComments = (await fbCommentsRes.json()).map(c => ({ ...c, platform: 'facebook' }));
      }
      const mergedComments = [...igComments, ...fbComments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setComments(mergedComments);
    } catch (err) {
      addToast("Error fetching live backend data.", "error");
    }
  };

  // Fetch updated info when changing tabs
  useEffect(() => {
    if (isAuthenticated && !demoMode && token) {
      fetchBackendData(token);
    }
  }, [activeTab, isAuthenticated]);

  const submitFacebookToken = async (userToken) => {
    setIsConnectingFB(true);
    try {
      let igSuccess = false;
      let fbSuccess = false;
      let lastErrorDetail = '';
      let isActionRequired = false;

      // Connect Instagram Business Accounts
      try {
        const res = await fetch(`${API_BASE}/auth/facebook-connect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ access_token: userToken })
        });
        if (res.ok) {
          const data = await res.json();
          setAccounts(data);
          igSuccess = true;
        } else {
          const err = await res.json().catch(() => ({}));
          lastErrorDetail = err.detail || `Meta Error (HTTP ${res.status}): Failed to connect Instagram Business account.`;
          if (
            lastErrorDetail.toLowerCase().includes("no instagram business") ||
            lastErrorDetail.toLowerCase().includes("verify page setup") ||
            lastErrorDetail.toLowerCase().includes("permission") ||
            lastErrorDetail.toLowerCase().includes("no facebook pages")
          ) {
            isActionRequired = true;
          }
        }
      } catch (err) {
        console.warn("Instagram connection error:", err);
        if (!lastErrorDetail) lastErrorDetail = err.message || "Network error communicating with Instagram connection endpoint.";
      }

      // Connect Facebook Pages
      try {
        const res = await fetch(`${API_BASE}/auth/facebook-connect-page`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ access_token: userToken })
        });
        if (res.ok) {
          const data = await res.json();
          setFacebookAccounts(data);
          fbSuccess = true;
        } else if (!lastErrorDetail) {
          const err = await res.json().catch(() => ({}));
          lastErrorDetail = err.detail || `Meta Error (HTTP ${res.status}): Failed to connect Facebook Page.`;
          if (lastErrorDetail.toLowerCase().includes("no facebook pages")) {
            isActionRequired = true;
          }
        }
      } catch (err) {
        console.warn("Facebook Page connection error:", err);
      }

      if (igSuccess || fbSuccess) {
        setMetaConnectionStatus('connected');
        setMetaErrorMessage('');
        setMetaErrorDetails('');
        setMetaErrorType('');
        addToast("Successfully linked your Meta accounts, discovered Pages and Instagram Business channels.", "success");
        fetchBackendData();
      } else {
        if (isActionRequired || lastErrorDetail.toLowerCase().includes("no instagram") || lastErrorDetail.toLowerCase().includes("verify page")) {
          setMetaConnectionStatus('action_required');
          setMetaErrorMessage(lastErrorDetail || "No Instagram Business Account Linked to Facebook Page");
          setMetaErrorType('no_ig_linked');
          setMetaErrorDetails("Meta requires an Instagram Professional (Creator or Business) account connected directly to your Facebook Page in Facebook Page Settings > Linked Accounts > Instagram.");
          addToast("Action Required: Please link your Instagram account to your Facebook Page.", "warning");
        } else {
          setMetaConnectionStatus('failed');
          setMetaErrorMessage(lastErrorDetail || "Meta authorization was rejected or connection failed.");
          setMetaErrorType('meta_error');
          setMetaErrorDetails("Meta returned an error during account verification. Please verify your Facebook permissions or developer app configurations, then retry.");
          addToast(`Connection Failed: ${lastErrorDetail || 'Please check tokens and permissions.'}`, "error");
        }
      }
    } catch (err) {
      setMetaConnectionStatus('failed');
      setMetaErrorMessage(err.message || "Failed to communicate with Meta discovery service.");
      setMetaErrorDetails("A network error prevented communication with the backend service. Please verify your connection.");
      addToast("Failed to communicate with Meta discovery service.", "error");
    } finally {
      setIsConnectingFB(false);
    }
  };

  const handleDisconnectInstagram = (accId) => {
    requestConfirmation({
      title: "Disconnect Instagram Account",
      message: "Are you sure you want to disconnect this Instagram account?",
      confirmText: "Disconnect Account",
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/accounts/instagram/${accId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            addToast("Instagram account disconnected successfully", "success");
            const updatedAccs = accounts.filter(p => p.id !== accId);
            setAccounts(updatedAccs);
            if (updatedAccs.length === 0 && facebookAccounts.length === 0) {
              setMetaConnectionStatus('not_connected');
            }
            setPosts(prev => prev.filter(p => p.instagram_account_id !== accId));
            setSelectedInstagramAccount(prev => (String(prev) === String(accId) ? 'all' : prev));
            fetchBackendData();
          } else {
            addToast("Failed to disconnect Instagram account", "error");
          }
        } catch (err) {
          addToast("Network error while disconnecting account", "error");
        }
      }
    });
  };

  const handleDisconnectFacebook = (accId) => {
    requestConfirmation({
      title: "Disconnect Facebook Page",
      message: "Are you sure you want to disconnect this Facebook Page?",
      confirmText: "Disconnect Page",
      variant: "danger",
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/accounts/facebook/${accId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            addToast("Facebook Page disconnected successfully", "success");
            const updatedFb = facebookAccounts.filter(p => p.id !== accId);
            setFacebookAccounts(updatedFb);
            if (accounts.length === 0 && updatedFb.length === 0) {
              setMetaConnectionStatus('not_connected');
            }
            setFacebookPosts(prev => prev.filter(p => p.facebook_account_id !== accId));
            setSelectedFacebookAccount(prev => (String(prev) === String(accId) ? 'all' : prev));
            fetchBackendData();
          } else {
            addToast("Failed to disconnect Facebook Page", "error");
          }
        } catch (err) {
          addToast("Network error while disconnecting page", "error");
        }
      }
    });
  };

  // Facebook Connect Handshake
  const handleFacebookConnect = async (option = 'default') => {
    setIsConnectingFB(true);

    if (demoMode) {
      // Simulate mock connection
      setTimeout(() => {
        const randId = Math.floor(Math.random() * 900);
        const newAcc = {
          id: Date.now(),
          instagram_business_account_id: "99" + randId,
          username: `brand_growth_${randId}`,
          name: `Brand Growth Inc ${randId}`,
          profile_picture_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          page_id: `page_${randId}`,
          page_name: `Brand Growth FB ${randId}`,
          connected_at: new Date().toISOString()
        };
        const newFbAcc = {
          id: Date.now() + 1,
          facebook_page_id: "fb_page_" + randId,
          username: `brand_growth_fb_${randId}`,
          name: `Brand Growth Facebook Page ${randId}`,
          profile_picture_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          connected_at: new Date().toISOString()
        };
        setAccounts(prev => [...prev, newAcc]);
        setFacebookAccounts(prev => [...prev, newFbAcc]);
        setMetaConnectionStatus('connected');
        setMetaErrorMessage('');
        setMetaErrorDetails('');
        setMetaErrorType('');
        addToast(`Connected Instagram Business account & Facebook Page: Brand Growth Inc ${randId} (Mock)`, "success");
        setIsConnectingFB(false);
      }, 800);
      return;
    }

    // Wait up to 2 seconds if window.FB is currently loading
    let fbInstance = window.FB;
    if (!fbInstance) {
      for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 200));
        if (window.FB) {
          fbInstance = window.FB;
          break;
        }
      }
    }

    if (!fbInstance) {
      setMetaConnectionStatus('failed');
      setMetaErrorMessage("Meta Facebook SDK was blocked by browser or ad-blocker.");
      setMetaErrorType('sdk_blocked');
      setMetaErrorDetails("Browser privacy shields or ad blockers often block 'connect.facebook.net'. Please disable ad-blockers for this domain and reload.");
      addToast("Meta Facebook SDK is not loaded. Please ensure ad blockers are disabled and refresh the page.", "error");
      setIsConnectingFB(false);
      return;
    }

    const loginOptions = {
      scope: metaScopes,
      auth_type: 'rerequest'
    };
    if (option === 'reauthenticate') {
      loginOptions.auth_type = 'reauthenticate';
    }

    // Trigger Facebook SDK login
    fbInstance.login(function (response) {
      if (response && response.authResponse) {
        submitFacebookToken(response.authResponse.accessToken);
      } else {
        setMetaConnectionStatus('action_required');
        setMetaErrorMessage("Meta Authorization Incomplete or Cancelled");
        setMetaErrorType('cancelled');
        setMetaErrorDetails("The Meta Facebook login popup was closed before completing authorization, or required permissions were unselected. Please click 'Connect Meta Account' again and allow all requested permissions.");
        addToast("Facebook connection cancelled or not fully authorized.", "warning");
        setIsConnectingFB(false);
      }
    }, loginOptions);
  };

  const handleSyncPosts = async () => {
    if (demoMode) {
      setFacebookPosts(MOCK_FACEBOOK_POSTS);
      setPosts(MOCK_POSTS);
      addToast("Synchronized mock posts successfully.", "success");
      return;
    }

    const hasAccounts = accounts.length > 0 || facebookAccounts.length > 0;
    if (!hasAccounts) {
      addToast("Please connect an Instagram or Facebook account first.", "warning");
      return;
    }

    setIsSyncingPosts(true);
    try {
      const promises = [];
      const isDashboard = activeTab === 'dashboard';
      const syncIg = isDashboard || postsFilterPlatform === 'all' || postsFilterPlatform === 'instagram';
      const syncFb = isDashboard || postsFilterPlatform === 'all' || postsFilterPlatform === 'facebook';

      if (syncIg && accounts.length > 0) {
        const igUrl = (!isDashboard && selectedInstagramAccount && selectedInstagramAccount !== 'all')
          ? `${API_BASE}/posts/sync?instagram_account_id=${selectedInstagramAccount}`
          : `${API_BASE}/posts/sync`;
        promises.push(
          fetch(igUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(async res => {
            if (res.ok) {
              const synced = await res.json();
              if (!isDashboard && selectedInstagramAccount && selectedInstagramAccount !== 'all') {
                setPosts(prev => {
                  const others = prev.filter(p => String(p.instagram_account_id) !== String(selectedInstagramAccount));
                  return [...synced, ...others];
                });
              } else {
                setPosts(synced);
              }
            }
          })
        );
      }

      if (syncFb && facebookAccounts.length > 0) {
        const fbUrl = (!isDashboard && selectedFacebookAccount && selectedFacebookAccount !== 'all')
          ? `${API_BASE}/posts/facebook/sync?facebook_account_id=${selectedFacebookAccount}`
          : `${API_BASE}/posts/facebook/sync`;
        promises.push(
          fetch(fbUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(async res => {
            if (res.ok) {
              const synced = await res.json();
              if (!isDashboard && selectedFacebookAccount && selectedFacebookAccount !== 'all') {
                setFacebookPosts(prev => {
                  const others = prev.filter(p => String(p.facebook_account_id) !== String(selectedFacebookAccount));
                  return [...synced, ...others];
                });
              } else {
                setFacebookPosts(synced);
              }
            }
          })
        );
      }

      await Promise.all(promises);
      setLastSyncedAt(new Date());
      addToast("Synchronized social posts with Meta successfully.", "success");
    } catch (err) {
      addToast("Connection error while syncing posts.", "error");
    } finally {
      setIsSyncingPosts(false);
    }
  };

  const handleCreateFuturePost = async (e) => {
    if (e) e.preventDefault();
    if (demoMode) {
      const isFb = postsFilterPlatform === 'facebook';
      const newPostId = `mock_future_${isFb ? 'fb' : 'ig'}_${Date.now()}`;
      const newPost = {
        id: newPostId,
        caption: futurePostForm.caption,
        media_type: isFb ? 'post' : futurePostForm.media_type,
        media_url: futurePostForm.media_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
        permalink: isFb ? `https://facebook.com/${newPostId}` : `https://instagram.com/p/${newPostId}`,
        timestamp: new Date().toISOString(),
        automation_status: (futurePostForm.keyword && futurePostForm.reply_message) ? 'active' : 'setup',
        keyword: futurePostForm.keyword || null,
        reply_message: futurePostForm.reply_message || null,
        dm_message: futurePostForm.dm_message || null,
        is_future_post: true
      };

      if (isFb) {
        newPost.facebook_account_id = parseInt(futurePostForm.facebook_account_id) || (facebookAccounts[0]?.id || 1);
        setFacebookPosts(prev => [newPost, ...prev]);
      } else {
        newPost.instagram_account_id = parseInt(futurePostForm.instagram_account_id) || (accounts[0]?.id || 1);
        setPosts(prev => [newPost, ...prev]);
      }

      addToast("Created future post in demo mode.", "success");
      setShowFuturePostModal(false);
      setFuturePostForm({
        instagram_account_id: '',
        facebook_account_id: '',
        caption: '',
        media_type: 'IMAGE',
        media_url: '',
        keyword: '',
        reply_message: '',
        dm_message: ''
      });
      return;
    }

    const isFb = postsFilterPlatform === 'facebook';
    const payload = isFb ? {
      facebook_account_id: parseInt(futurePostForm.facebook_account_id) || facebookAccounts[0]?.id,
      caption: futurePostForm.caption,
      media_type: 'post',
      media_url: futurePostForm.media_url || null,
      keyword: futurePostForm.keyword || null,
      reply_message: futurePostForm.reply_message || null,
      dm_message: futurePostForm.dm_message || null
    } : {
      instagram_account_id: parseInt(futurePostForm.instagram_account_id) || accounts[0]?.id,
      caption: futurePostForm.caption,
      media_type: futurePostForm.media_type,
      media_url: futurePostForm.media_url || null,
      keyword: futurePostForm.keyword || null,
      reply_message: futurePostForm.reply_message || null,
      dm_message: futurePostForm.dm_message || null
    };

    if (isFb && !payload.facebook_account_id) {
      addToast("Please connect a Facebook Page first.", "warning");
      return;
    }
    if (!isFb && !payload.instagram_account_id) {
      addToast("Please connect an Instagram Account first.", "warning");
      return;
    }

    try {
      const url = isFb ? `${API_BASE}/posts/facebook/future` : `${API_BASE}/posts/future`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        addToast("Future post created successfully.", "success");
        setShowFuturePostModal(false);
        setFuturePostForm({
          instagram_account_id: '',
          facebook_account_id: '',
          caption: '',
          media_type: 'IMAGE',
          media_url: '',
          keyword: '',
          reply_message: '',
          dm_message: ''
        });
        fetchBackendData();
      } else {
        const err = await res.json();
        addToast(err.detail || "Failed to create future post.", "error");
      }
    } catch (err) {
      addToast("Connection error while creating future post.", "error");
    }
  };

  const handleUpdatePostAutomation = async (e) => {
    if (e) e.preventDefault();
    if (!selectedPostForAutomation) return;

    if (demoMode) {
      const isFb = postsFilterPlatform === 'facebook';
      const updatePost = (p) => {
        if (p.id === selectedPostForAutomation.id) {
          return {
            ...p,
            automation_status: automationForm.automation_status,
            keyword: automationForm.keyword || null,
            reply_message: automationForm.reply_message || null,
            dm_message: automationForm.dm_message || null
          };
        }
        return p;
      };

      if (isFb) {
        setFacebookPosts(prev => prev.map(updatePost));
      } else {
        setPosts(prev => prev.map(updatePost));
      }

      addToast("Updated automation configuration in demo mode.", "success");
      setShowConfigureAutomationModal(false);
      setSelectedPostForAutomation(null);
      return;
    }

    const isFb = postsFilterPlatform === 'facebook';
    const payload = {
      automation_status: automationForm.automation_status,
      keyword: automationForm.keyword || null,
      reply_message: automationForm.reply_message || null,
      dm_message: automationForm.dm_message || null
    };

    try {
      const url = isFb
        ? `${API_BASE}/posts/facebook/${selectedPostForAutomation.id}/automation`
        : `${API_BASE}/posts/${selectedPostForAutomation.id}/automation`;

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        addToast("Automation updated successfully.", "success");
        setShowConfigureAutomationModal(false);
        setSelectedPostForAutomation(null);
        fetchBackendData();
      } else {
        const err = await res.json();
        addToast(err.detail || "Failed to update automation.", "error");
      }
    } catch (err) {
      addToast("Connection error while updating automation.", "error");
    }
  };

  const handleUploadDmImage = async (file) => {
    if (!file) return;
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(ext)) {
      addToast("Please upload a valid image (JPG, PNG, WEBP, or GIF).", "warning");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      addToast("Image must be smaller than 10MB.", "warning");
      return;
    }

    setIsUploadingDmImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/dm-automation/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setDmRuleForm(prev => ({ ...prev, image_url: data.url }));
          addToast("Image uploaded successfully!", "success");
        }
      } else {
        const err = await res.json().catch(() => ({}));
        addToast(err.detail || "Failed to upload image to server.", "error");
      }
    } catch (err) {
      console.error("Upload error:", err);
      if (demoMode) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setDmRuleForm(prev => ({ ...prev, image_url: e.target.result }));
          addToast("Image loaded in demo mode", "success");
        };
        reader.readAsDataURL(file);
      } else {
        addToast("Error uploading image.", "error");
      }
    } finally {
      setIsUploadingDmImage(false);
    }
  };

  const handleOpenNewDmRule = (presetType = 'link_dm') => {
    setEditingDmRule(null);
    const activeAccount = accounts[0];
    const accountProfileUrl = activeAccount?.username ? `https://instagram.com/${activeAccount.username}` : 'https://instagram.com';
    setDmRuleForm({
      instagram_account_id: activeAccount?.id || '',
      name: 'Link DM Flow #1',
      trigger_type: 'any_message',
      keyword: '',
      reply_text: 'Here is the link you requested 👇',
      is_active: true,
      dm_type: 'follow_gate',
      entry_message: "👋 Thanks for the comment.\n\nTap the button below and I'll send you the link right away!\nReply STOP to opt-out",
      entry_button_text: "➡️ Send me the Link!",
      message_text: "Here is the link you requested 👇",
      title: '➡️ You need to be following me to unlock this DM',
      subtitle: 'Once you’re following, click the button below to get the DM!',
      button_text: 'Open Link',
      button_url: 'https://fitlife.co/shop',
      link_url: 'https://fitlife.co/shop',
      image_url: '',
      require_follow: true,
      follow_username: 'rish.jain89',
      follow_intro_text: 'Follow me here ➡️ @rish.jain89',
      follow_url: 'https://instagram.com/rish.jain89',
      follow_button_text: 'Follow me here',
      confirm_button_text: "✅ Send me the DM",
      final_link_url: 'https://fitlife.co/shop',
      final_dm_text: 'Here is the link you requested 👇'
    });
    setPreviewStep(1);
    setModalTab('dm_setup');
    setShowDmModal(true);
  };

  const handleOpenEditDmRule = (rule) => {
    setEditingDmRule(rule);
    let parsedReply = {
      text: rule.reply_text,
      dm_type: 'follow_gate',
      entry_message: "👋 Thanks for the comment.\n\nTap the button below and I'll send you the link right away!\nReply STOP to opt-out",
      entry_button_text: "➡️ Send me the Link!",
      message_text: "Here is the link you requested 👇",
      title: '➡️ You need to be following me to unlock this DM',
      subtitle: 'Once you’re following, click the button below to get the DM!',
      button_text: 'Open Link',
      button_url: 'https://fitlife.co/shop',
      link_url: 'https://fitlife.co/shop',
      image_url: '',
      require_follow: true,
      follow_username: 'rish.jain89',
      follow_intro_text: 'Follow me here ➡️ @rish.jain89',
      follow_url: 'https://instagram.com/rish.jain89',
      follow_button_text: 'Follow me here',
      confirm_button_text: '✅ Send me the DM',
      final_link_url: '',
      final_dm_text: ''
    };
    try {
      const stripped = (rule.reply_text || '').trim();
      if (stripped.startsWith('{') && stripped.endsWith('}')) {
        const jsonReply = JSON.parse(stripped);
        const isFollowGate = Boolean(jsonReply.require_follow || jsonReply.dm_type === 'follow_gate');
        parsedReply = {
          text: jsonReply.text || jsonReply.reply_text || jsonReply.message_text || '',
          dm_type: isFollowGate ? 'follow_gate' : (jsonReply.dm_type || 'link_dm'),
          entry_message: jsonReply.entry_message || "👋 Thanks for the comment.\n\nTap the button below and I'll send you the link right away!\nReply STOP to opt-out",
          entry_button_text: jsonReply.entry_button_text || "➡️ Send me the Link!",
          message_text: jsonReply.message_text || jsonReply.text || jsonReply.reply_text || "Here is the link you requested 👇",
          title: jsonReply.title || '➡️ You need to be following me to unlock this DM',
          subtitle: jsonReply.subtitle || 'Once you’re following, click the button below to get the DM!',
          button_text: jsonReply.button_text || jsonReply.link_button_text || 'Open Link',
          button_url: jsonReply.link_url || jsonReply.button_url || '',
          link_url: jsonReply.link_url || jsonReply.button_url || '',
          image_url: jsonReply.image_url || '',
          require_follow: isFollowGate,
          follow_username: jsonReply.follow_username || 'rish.jain89',
          follow_intro_text: jsonReply.follow_intro_text || 'Follow me here ➡️ @rish.jain89',
          follow_url: jsonReply.follow_url || 'https://instagram.com/rish.jain89',
          follow_button_text: jsonReply.follow_button_text || 'Follow me here',
          confirm_button_text: jsonReply.confirm_button_text || '✅ Send me the DM',
          final_link_url: jsonReply.final_link_url || '',
          final_dm_text: jsonReply.final_dm_text || ''
        };
      }
    } catch (e) {
      // Plain text
    }

    setDmRuleForm({
      instagram_account_id: rule.instagram_account_id,
      name: rule.name,
      trigger_type: rule.trigger_type,
      keyword: rule.keyword || '',
      reply_text: parsedReply.message_text || parsedReply.text || rule.reply_text || '',
      is_active: rule.is_active,
      dm_type: parsedReply.dm_type || 'link_dm',
      entry_message: parsedReply.entry_message,
      entry_button_text: parsedReply.entry_button_text,
      message_text: parsedReply.message_text,
      title: parsedReply.title || '',
      subtitle: parsedReply.subtitle || '',
      button_text: parsedReply.button_text,
      button_url: parsedReply.link_url || parsedReply.button_url || '',
      link_url: parsedReply.link_url || parsedReply.button_url || '',
      image_url: parsedReply.image_url || '',
      require_follow: Boolean(parsedReply.require_follow),
      follow_username: parsedReply.follow_username || 'rish.jain89',
      follow_intro_text: parsedReply.follow_intro_text,
      follow_url: parsedReply.follow_url,
      follow_button_text: parsedReply.follow_button_text || 'Follow me here',
      confirm_button_text: parsedReply.confirm_button_text || '✅ Send me the DM',
      final_link_url: parsedReply.final_link_url || '',
      final_dm_text: parsedReply.final_dm_text || ''
    });
    setPreviewStep(1);
    setModalTab('dm_setup');
    setShowDmModal(true);
  };

  const handleSaveDmRule = async (e) => {
    e.preventDefault();
    if (!dmRuleForm.instagram_account_id) {
      if (accounts.length === 0) {
        addToast("Please link an Instagram account first in Facebook / Meta Accounts to activate rules.", "warning");
      } else {
        setModalTab('trigger_setup');
        addToast("Please select an Instagram account in the Trigger Setup tab.", "warning");
      }
      return;
    }
    if (!dmRuleForm.name) {
      addToast("Please enter a name for this automation rule.", "warning");
      return;
    }

    // Build the serialized reply text
    let replyText = dmRuleForm.reply_text;
    if (dmRuleForm.dm_type === 'link_dm' || dmRuleForm.dm_type === 'button_template' || dmRuleForm.dm_type === 'follow_gate' || dmRuleForm.require_follow) {
      const msgText = (dmRuleForm.message_text || dmRuleForm.reply_text || 'Here is the link you requested 👇').trim();
      const targetUrl = dmRuleForm.link_url || dmRuleForm.button_url || 'https://fitlife.co/shop';
      const targetBtn = (dmRuleForm.button_text || 'Open Link').trim();

      replyText = JSON.stringify({
        dm_type: dmRuleForm.require_follow ? 'follow_gate' : (dmRuleForm.dm_type || 'link_dm'),
        require_follow: Boolean(dmRuleForm.require_follow),
        follow_username: dmRuleForm.follow_username || 'rish.jain89',
        entry_message: dmRuleForm.entry_message || "Thanks for your comment! 👋 Click below and I'll send you the link.",
        step1_text: dmRuleForm.entry_message || "Thanks for your comment! 👋 Click below and I'll send you the link.",
        entry_button_text: dmRuleForm.entry_button_text || "Send Me the Link",
        step1_button_text: dmRuleForm.entry_button_text || "Send Me the Link",
        follow_intro_text: dmRuleForm.follow_intro_text || 'Follow me here ➡️ @rish.jain89',
        title: dmRuleForm.title || '➡️ You need to be following me to unlock this DM',
        subtitle: dmRuleForm.subtitle || 'Once you’re following, click the button below to get the DM!',
        follow_url: dmRuleForm.follow_url || 'https://instagram.com/rish.jain89',
        follow_button_text: dmRuleForm.follow_button_text || 'Follow me here',
        confirm_button_text: dmRuleForm.confirm_button_text || '✅ Send me the DM',
        message_text: msgText,
        text: msgText,
        button_text: targetBtn,
        button_url: targetUrl,
        link_url: targetUrl,
        image_url: dmRuleForm.image_url || ''
      });
    } else if (dmRuleForm.dm_type === 'image') {
      replyText = JSON.stringify({
        text: dmRuleForm.reply_text,
        dm_type: 'image',
        image_url: dmRuleForm.image_url || ''
      });
    } else if (dmRuleForm.dm_type === 'message_template') {
      replyText = JSON.stringify({
        text: dmRuleForm.reply_text,
        dm_type: 'message_template'
      });
    }

    setIsDmsSaving(true);
    if (demoMode) {
      if (editingDmRule) {
        setDmRules(prev => prev.map(r => r.id === editingDmRule.id ? { ...r, ...dmRuleForm, reply_text: replyText } : r));
        addToast("Rule updated successfully (Mock)", "success");
      } else {
        const newRule = {
          ...dmRuleForm,
          reply_text: replyText,
          id: 'dm_rule_' + Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setDmRules(prev => [...prev, newRule]);
        addToast("Rule created successfully (Mock)", "success");
      }
      setShowDmModal(false);
      setEditingDmRule(null);
      setIsDmsSaving(false);
      return;
    }

    try {
      const isEdit = !!editingDmRule;
      const url = isEdit ? `${API_BASE}/dm-automation/${editingDmRule.id}` : `${API_BASE}/dm-automation`;
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        instagram_account_id: parseInt(dmRuleForm.instagram_account_id),
        name: dmRuleForm.name,
        trigger_type: dmRuleForm.trigger_type || 'any_message',
        keyword: null,
        reply_text: replyText,
        is_active: dmRuleForm.is_active
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const savedRule = await res.json();
        addToast(`Rule ${isEdit ? 'updated' : 'created'} successfully!`, "success");
        setShowDmModal(false);
        setEditingDmRule(null);
        if (isEdit) {
          setDmRules(prev => prev.map(r => r.id === savedRule.id ? savedRule : r));
        } else {
          setDmRules(prev => [...prev, savedRule]);
        }
        fetchBackendData(token);
      } else {
        const err = await res.json();
        addToast(err.detail || "Failed to save rule.", "error");
      }
    } catch (err) {
      addToast("Connection error while saving rule.", "error");
    } finally {
      setIsDmsSaving(false);
    }
  };

  const handleDeleteDmRule = (ruleId) => {
    setDeleteConfirmRuleId(ruleId);
  };

  const handleConfirmDeleteDmRule = async () => {
    const ruleId = deleteConfirmRuleId;
    if (!ruleId) return;

    if (demoMode) {
      setDmRules(prev => prev.filter(r => r.id !== ruleId));
      addToast("Rule deleted successfully (Mock)", "success");
      setDeleteConfirmRuleId(null);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/dm-automation/${ruleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        addToast("Rule deleted successfully!", "success");
        setDmRules(prev => prev.filter(r => r.id !== ruleId));
        fetchBackendData(token);
      } else {
        const err = await res.json();
        addToast(err.detail || "Failed to delete rule.", "error");
      }
    } catch (err) {
      addToast("Connection error while deleting rule.", "error");
    } finally {
      setDeleteConfirmRuleId(null);
    }
  };

  const handleDeleteFlow = (flowId) => {
    setDeleteConfirmFlowId(flowId);
  };

  const handleConfirmDeleteFlow = async () => {
    const flowId = deleteConfirmFlowId;
    if (!flowId) return;

    if (demoMode) {
      setFlows(prev => prev.filter(f => f.id !== flowId));
      addToast("Flow deleted successfully (Mock)", "success");
      setDeleteConfirmFlowId(null);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/automation/${flowId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        addToast("Flow deleted successfully!", "success");
        setFlows(prev => prev.filter(f => f.id !== flowId));
        fetchBackendData(token);
      } else {
        const err = await res.json();
        addToast(err.detail || "Failed to delete flow.", "error");
      }
    } catch (err) {
      console.error("Delete flow error:", err);
      addToast("Connection error while deleting flow.", "error");
    } finally {
      setDeleteConfirmFlowId(null);
    }
  };

  const handleToggleDmRuleActive = async (rule) => {
    const updatedStatus = !rule.is_active;
    if (demoMode) {
      setDmRules(prev => prev.map(r => r.id === rule.id ? { ...r, is_active: updatedStatus } : r));
      addToast(`Rule is now ${updatedStatus ? 'active' : 'inactive'} (Mock)`, "success");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/dm-automation/${rule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: updatedStatus })
      });
      if (res.ok) {
        addToast(`Rule is now ${updatedStatus ? 'active' : 'inactive'}!`, "success");
        setDmRules(prev => prev.map(r => r.id === rule.id ? { ...r, is_active: updatedStatus } : r));
        fetchBackendData(token);
      } else {
        addToast("Failed to toggle active state of rule.", "error");
      }
    } catch (err) {
      addToast("Connection error.", "error");
    }
  };


  const handleRunSingleFlow = async (flowId) => {
    if (demoMode) {
      setRunningFlowId(flowId);
      setTimeout(() => {
        const targetFlow = flows.find(f => f.id === flowId);
        const keywords = targetFlow?.nodes
          ?.filter(n => n.type === 'trigger')
          ?.flatMap(n => n.config?.keywords || []) || [];

        const newMockComments = [];
        const newMockLogs = [];
        let count = 0;

        if (keywords.includes("guide")) {
          const cid = `c_single_${Date.now()}_1`;
          newMockComments.push({
            comment_id: cid,
            media_id: "media_post_1",
            text: "I want the guide!",
            username: "clara_reads",
            timestamp: new Date().toISOString(),
            status: "processed"
          });
          newMockLogs.push(
            { id: Math.random(), flow_id: flowId, comment_id: cid, action_type: "trigger_match", status: "success", created_at: new Date().toISOString(), details: { matched_keywords: ["guide"] } },
            { id: Math.random(), flow_id: flowId, comment_id: cid, action_type: "reply_sent", status: "success", created_at: new Date().toISOString(), details: { reply_id: `rep_s1_${Date.now()}` } }
          );
          count += 1;
        }

        if (keywords.includes("Best") || keywords.includes("View💯")) {
          const cid = `c_single_${Date.now()}_2`;
          newMockComments.push({
            comment_id: cid,
            media_id: "media_post_2",
            text: "Best",
            username: "alex_gym",
            timestamp: new Date().toISOString(),
            status: "processed"
          });
          newMockLogs.push(
            { id: Math.random(), flow_id: flowId, comment_id: cid, action_type: "trigger_match", status: "success", created_at: new Date().toISOString(), details: { matched_keywords: ["Best"] } },
            { id: Math.random(), flow_id: flowId, comment_id: cid, action_type: "reply_sent", status: "success", created_at: new Date().toISOString(), details: { reply_id: `rep_s2_${Date.now()}` } }
          );
          count += 1;
        }

        if (count > 0) {
          setComments(prev => [...newMockComments, ...prev]);
          setLogs(prev => [...newMockLogs, ...prev]);
          setAnalytics(prev => ({
            ...prev,
            total_comments: prev.total_comments + count,
            replies_sent: prev.replies_sent + count,
            dms_sent: prev.dms_sent + count
          }));
        }

        setRunningFlowId(null);
        addToast(`Flow "${targetFlow?.name || 'Selected'}" executed! Processed ${count} pending comment(s).`, "success");
      }, 1500);
      return;
    }

    setRunningFlowId(flowId);
    try {
      const res = await fetch(`${API_BASE}/automation/${flowId}/run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        addToast(`Flow executed! Processed ${data.processed_count} comment(s).`, "success");
        await fetchBackendData();
      } else {
        const err = await res.json();
        addToast(err.detail || "Flow execution failed.", "error");
      }
    } catch (err) {
      addToast("Failed to connect to flow automation endpoint.", "error");
    } finally {
      setRunningFlowId(null);
    }
  };

  const handleScanFutureFlow = async (flowId) => {
    if (!flowId) return;
    setScanningFlowId(flowId);
    try {
      const res = await fetch(`${API_BASE}/automation/${flowId}/scan-for-post`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        if (data.status === 'resolved') {
          addToast(`✅ Future Flow matched! Linked to post: ${data.matched_post_id}`, 'success');
        } else if (data.status === 'already_resolved') {
          addToast('This Future Flow is already resolved.', 'info');
        } else {
          addToast(`⏳ No match found yet (scanned ${data.posts_scanned || 0} posts). Will retry automatically.`, 'warning');
        }
        await fetchBackendData();
      } else {
        addToast(data.detail || 'Scan failed. Please try again.', 'error');
      }
    } catch (err) {
      addToast('Failed to connect to scan endpoint.', 'error');
    } finally {
      setScanningFlowId(null);
    }
  };

  const handleOpenComments = async (post) => {
    setActiveCommentsPost(post);
    setPostComments([]);
    setIsFetchingComments(true);
    setReplyingToCommentId(null);
    setNewReplyText("");
    setNewCommentText("");
    const isFb = !!post.facebook_account_id;
    const url = isFb
      ? `${API_BASE}/posts/facebook/${post.id}/comments`
      : `${API_BASE}/posts/${post.id}/comments`;
    try {
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setPostComments(await res.json());
      } else {
        addToast("Failed to fetch comments for this post.", "error");
      }
    } catch (err) {
      addToast("Failed to connect to comments service.", "error");
    } finally {
      setIsFetchingComments(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setIsSubmittingComment(true);
    const isFb = !!activeCommentsPost.facebook_account_id;
    const url = isFb
      ? `${API_BASE}/posts/facebook/${activeCommentsPost.id}/comments`
      : `${API_BASE}/posts/${activeCommentsPost.id}/comments`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: newCommentText })
      });
      if (res.ok) {
        const createdComment = await res.json();
        setPostComments(prev => [...prev, createdComment]);
        setNewCommentText("");
        addToast(`Comment successfully posted to ${isFb ? 'Facebook' : 'Instagram'}!`, "success");
      } else {
        const err = await res.json();
        addToast(err.detail || "Failed to post comment.", "error");
      }
    } catch (err) {
      addToast("Failed to communicate with API server.", "error");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleAddReply = async (commentId) => {
    if (!newReplyText.trim()) return;
    setIsSubmittingReply(true);
    const isFb = !!activeCommentsPost.facebook_account_id;
    const url = isFb
      ? `${API_BASE}/posts/facebook/${activeCommentsPost.id}/comments/${commentId}/replies`
      : `${API_BASE}/posts/${activeCommentsPost.id}/comments/${commentId}/replies`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: newReplyText })
      });
      if (res.ok) {
        const createdReply = await res.json();
        setPostComments(prev => [...prev, createdReply]);
        setReplyingToCommentId(null);
        setNewReplyText("");
        addToast(`Reply successfully posted to ${isFb ? 'Facebook' : 'Instagram'}!`, "success");
      } else {
        const err = await res.json();
        addToast(err.detail || "Failed to post reply.", "error");
      }
    } catch (err) {
      addToast("Failed to communicate with API server.", "error");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const isFb = !!activeCommentsPost.facebook_account_id;
    const url = isFb
      ? `${API_BASE}/posts/facebook/${activeCommentsPost.id}/comments/${commentId}`
      : `${API_BASE}/posts/${activeCommentsPost.id}/comments/${commentId}`;
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setPostComments(prev => prev.filter(c => c.id !== commentId && c.parent_id !== commentId));
        addToast("Comment successfully deleted!", "success");
      } else {
        const err = await res.json();
        addToast(err.detail || "Failed to delete comment.", "error");
      }
    } catch (err) {
      addToast("Failed to communicate with API server.", "error");
    }
  };

  // Open Visual Flow Builder
  const handleOpenBuilder = (flow) => {
    const linkedInfo = getFlowLinkedPost(flow);
    let preparedFlow = { ...flow };
    if (linkedInfo?.postId) {
      if (linkedInfo.isFb && !preparedFlow.facebook_post_id) {
        preparedFlow.facebook_post_id = String(linkedInfo.postId);
      } else if (!linkedInfo.isFb && !preparedFlow.instagram_post_id) {
        preparedFlow.instagram_post_id = String(linkedInfo.postId);
      }
      if (!preparedFlow.is_future_flow) {
        preparedFlow.is_future_flow = false;
      }
    }
    setSelectedFlow(preparedFlow);
    setBuilderNodes(flow.nodes || []);
    setBuilderEdges(flow.edges || []);
    setSelectedNode(flow.nodes?.[0] || null);
    setActiveTab('builder');
  };

  const handleOpenVisualFlowForPost = (post) => {
    if (!post) return;

    const isFb = checkIsFbPost(post);
    const existing = getFlowForPost(post);

    if (existing) {
      handleOpenBuilder(existing);
    } else {
      const timestamp = Date.now();
      const triggerId = "node_trig_" + timestamp;
      const replyId = "node_rep_" + timestamp;
      const dmId = "node_dm_" + timestamp;
      const edgeId1 = "edge_trig_rep_" + timestamp;
      const edgeId2 = "edge_rep_dm_" + timestamp;

      const defaultIgAccId = accounts.length > 0 ? accounts[0].id : null;
      const defaultFbAccId = facebookAccounts.length > 0 ? facebookAccounts[0].id : null;

      const newFlow = {
        id: "flow_" + timestamp,
        name: `Post Flow: ${post.caption ? post.caption.slice(0, 20) : 'Post ' + post.id}`,
        is_active: true,
        instagram_account_id: isFb ? null : (post.instagram_account_id || defaultIgAccId),
        facebook_account_id: isFb ? (post.facebook_account_id || defaultFbAccId) : null,
        instagram_post_id: isFb ? null : String(post.id),
        facebook_post_id: isFb ? String(post.id) : null,
        is_future_flow: false,
        nodes: [
          { id: triggerId, type: "trigger", config: { keywords: ["price"], exact_word: false } },
          { id: replyId, type: "action_reply", config: { message: "Thanks for commenting! Check your DMs 📩" } },
          { id: dmId, type: "action_dm", config: { message: "👋 Thanks for the comment.\n\nTap the button below and I'll send you the link right away!\nReply STOP to opt-out" } }
        ],
        edges: [
          { id: edgeId1, source_node_id: triggerId, target_node_id: replyId },
          { id: edgeId2, source_node_id: replyId, target_node_id: dmId }
        ]
      };

      setSelectedFlow(newFlow);
      setBuilderNodes(newFlow.nodes);
      setBuilderEdges(newFlow.edges);
      setSelectedNode(newFlow.nodes[0]);
      setActiveTab('builder');
    }
  };


  const handleCreateFutureFlow = () => {
    if (accounts.length === 0 && facebookAccounts.length === 0) {
      addToast("Please connect an Instagram or Facebook Account first.", "warning");
      return;
    }
    const timestamp = Date.now();
    const triggerId = "node_trig_" + timestamp;
    const replyId = "node_rep_" + timestamp;
    const dmId = "node_dm_" + timestamp;
    const edgeId1 = "edge_trig_rep_" + timestamp;
    const edgeId2 = "edge_rep_dm_" + timestamp;

    const defaultInstaId = accounts[0]?.id || null;
    const defaultFbId = !defaultInstaId ? (facebookAccounts[0]?.id || null) : null;

    const newFlow = {
      id: "flow_" + timestamp,
      name: "Future Post Automation " + (flows.filter(f => f.is_future_flow).length + 1),
      is_active: true,
      instagram_account_id: defaultInstaId,
      facebook_account_id: defaultFbId,
      is_future_flow: true,
      apply_to_all_future_posts: true,
      future_post_caption: "",
      future_flow_status: "pending",
      nodes: [
        { id: triggerId, type: "trigger", config: { keywords: ["Guide"], exact_word: false } },
        { id: replyId, type: "action_reply", config: { message: "Thanks for commenting! Check your DMs 📩" } },
        { id: dmId, type: "action_dm", config: { message: "👋 Thanks for the comment.\n\nTap the button below and I'll send you the link right away!\nReply STOP to opt-out" } }
      ],
      edges: [
        { id: edgeId1, source_node_id: triggerId, target_node_id: replyId },
        { id: edgeId2, source_node_id: replyId, target_node_id: dmId }
      ]
    };

    setFlows(prev => [...prev, newFlow]);
    handleOpenBuilder(newFlow);
  };

  const handleAddNode = (type) => {
    const id = "node_" + Date.now();
    let config = {};
    if (type === 'trigger') config = { keywords: ['newkeyword'], exact_word: true };
    else if (type === 'action_reply') config = { message: '' };
    else if (type === 'action_dm') config = { message: "👋 Thanks for the comment.\n\nTap the button below and I'll send you the link right away!\nReply STOP to opt-out" };
    else if (type === 'action_tag') config = { tag: 'customer_tag' };

    const newNode = { id, type, config };
    setBuilderNodes(prev => [...prev, newNode]);

    // Auto-create edge from previously selected node if applicable
    if (selectedNode) {
      const edgeId = "edge_" + Date.now();
      const newEdge = { id: edgeId, source_node_id: selectedNode.id, target_node_id: id };
      setBuilderEdges(prev => [...prev, newEdge]);
    }

    setSelectedNode(newNode);
    addToast(`Added ${type.replace('action_', '')} node.`, "info");
  };

  const handleDeleteNode = (nodeId) => {
    setBuilderNodes(prev => prev.filter(n => n.id !== nodeId));
    setBuilderEdges(prev => prev.filter(e => e.source_node_id !== nodeId && e.target_node_id !== nodeId));
    setSelectedNode(null);
  };

  const handleUpdateNodeConfig = (key, val) => {
    setBuilderNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        return { ...n, config: { ...n.config, [key]: val } };
      }
      return n;
    }));
    // Sync current selection
    setSelectedNode(prev => ({ ...prev, config: { ...prev.config, [key]: val } }));
  };

  const handleSaveFlow = async () => {
    const linkedInfo = getFlowLinkedPost(selectedFlow);
    const resolvedPostId = selectedFlow.instagram_post_id || (!selectedFlow.facebook_account_id && linkedInfo?.postId ? String(linkedInfo.postId) : null);
    const resolvedFbPostId = selectedFlow.facebook_post_id || (selectedFlow.facebook_account_id && linkedInfo?.postId ? String(linkedInfo.postId) : null);
    const isExplicitPostFlow = Boolean(selectedFlow.name?.startsWith("Post Flow: "));
    const isFutureFlow = Boolean(selectedFlow.is_future_flow && !isExplicitPostFlow);

    const payload = {
      instagram_account_id: selectedFlow.instagram_account_id,
      facebook_account_id: selectedFlow.facebook_account_id,
      instagram_post_id: resolvedPostId,
      facebook_post_id: resolvedFbPostId,
      name: selectedFlow.name,
      is_active: selectedFlow.is_active,
      nodes: builderNodes,
      edges: builderEdges,
      // Future flow fields (never on post-specific flows)
      is_future_flow: isFutureFlow,
      apply_to_all_future_posts: isFutureFlow ? Boolean(selectedFlow.apply_to_all_future_posts ?? true) : false,
      future_post_caption: isFutureFlow ? (selectedFlow.future_post_caption || null) : null,
      future_post_scheduled_at: isFutureFlow ? (selectedFlow.future_post_scheduled_at || null) : null,
    };

    if (demoMode) {
      setFlows(prev => prev.map(f => {
        if (f.id === selectedFlow.id) {
          return {
            ...f,
            name: selectedFlow.name,
            is_active: selectedFlow.is_active,
            instagram_account_id: selectedFlow.instagram_account_id,
            facebook_account_id: selectedFlow.facebook_account_id,
            nodes: builderNodes,
            edges: builderEdges,
            is_future_flow: isFutureFlow,
            apply_to_all_future_posts: payload.apply_to_all_future_posts,
            future_post_caption: payload.future_post_caption,
            future_post_scheduled_at: payload.future_post_scheduled_at,
          };
        }
        return f;
      }));
      addToast("Flow saved successfully (Local storage).", "success");
      setActiveTab('flows');
    } else {
      try {
        const isNew = selectedFlow.id.startsWith("flow_");
        const url = isNew ? `${API_BASE}/automation` : `${API_BASE}/automation/${selectedFlow.id}`;
        const method = isNew ? 'POST' : 'PUT';

        const res = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          addToast("Flow synchronized with Meta database successfully.", "success");
          fetchBackendData();
          setActiveTab('flows');
        } else {
          const err = await res.json();
          addToast(err.detail || "Save rejected by server.", "error");
        }
      } catch (err) {
        addToast("Error saving flow settings.", "error");
      }
    }
  };



  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        {/* Toast Notifications on Auth screens */}
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {toasts.map(t => (
            <div key={t.id} className="toast" style={{
              borderLeft: `6px solid ${t.type === 'success' ? 'var(--success)' : t.type === 'warning' ? 'var(--warning)' : t.type === 'error' ? 'var(--error)' : 'var(--primary)'}`
            }}>
              {t.type === 'warning' && <AlertTriangle size={18} className="text-warning" />}
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{t.message}</span>
            </div>
          ))}
        </div>

        {/* --- REGISTRATION PAGE --- */}
        {authMode === 'register' && (
          <div className="auth-card auth-card-wide">
            <div className="auth-header" style={{ marginBottom: '22px' }}>
              <img
                src="/shantidm-logo.png"
                alt="ShantiDM"
                style={{
                  height: '48px',
                  maxWidth: '210px',
                  objectFit: 'contain',
                  marginBottom: '14px',
                  display: 'inline-block',
                  filter: 'drop-shadow(0 4px 16px rgba(99, 102, 241, 0.35))'
                }}
              />
              <h1>Create a Free ShantiDM Account</h1>
              <p className="colorful-subheading">
                Automate your DMs. Engage your audience. Grow with ShantiDM!
              </p>
            </div>

            <form onSubmit={handleRegister} style={{ textAlign: 'left' }}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email address"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Business or Creator Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your business or creator name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <select
                    className="form-control"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select your country</option>
                    {COUNTRIES_LIST.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Account Type</label>
                  <select
                    className="form-control"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    required
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select your account type</option>
                    <option value="Creator / Influencer">Creator / Influencer</option>
                    <option value="E-Commerce / Online Store">E-Commerce / Online Store</option>
                    <option value="Agency / Social Media Manager">Agency / Social Media Manager</option>
                    <option value="Brand / Business">Brand / Business</option>
                    <option value="Coach / Consultant">Coach / Consultant</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showRegPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter your password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={showRegPassword ? "Hide Password" : "Show Password"}
                  >
                    {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={regLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.98rem',
                  fontWeight: '600',
                  marginTop: '10px',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                }}
              >
                {regLoading ? "Creating Account..." : "Get Started"}
              </button>
            </form>

            <div className="auth-footer">
              Already have an account?{" "}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => setAuthMode('login')}
              >
                Log In
              </button>
            </div>
          </div>
        )}

        {/* --- LOGIN PAGE --- */}
        {authMode === 'login' && (
          <div className="auth-card">
            <div className="auth-header" style={{ marginBottom: '24px' }}>
              <img
                src="/shantidm-logo.png"
                alt="ShantiDM"
                style={{
                  height: '48px',
                  maxWidth: '210px',
                  objectFit: 'contain',
                  marginBottom: '16px',
                  display: 'inline-block',
                  filter: 'drop-shadow(0 4px 16px rgba(99, 102, 241, 0.35))'
                }}
              />
              <h1>Hey Creator, Your DMs Missed You!</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                Log in to manage your automated replies and leads
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ margin: 0 }}>Password</label>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot_password'); setForgotSuccessMsg(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={showLoginPassword ? "Hide Password" : "Show Password"}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loginLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.98rem',
                  fontWeight: '600',
                  marginTop: '10px',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                }}
              >
                {loginLoading ? "Logging In..." : "Log In"}
              </button>
            </form>

            <div className="auth-footer">
              New user?{" "}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => setAuthMode('register')}
              >
                Create a Free Account
              </button>
            </div>
          </div>
        )}

        {/* --- FORGOT PASSWORD PAGE --- */}
        {authMode === 'forgot_password' && (
          <div className="auth-card">
            <div className="auth-header" style={{ marginBottom: '24px' }}>
              <img
                src="/shantidm-logo.png"
                alt="ShantiDM"
                style={{
                  height: '48px',
                  maxWidth: '210px',
                  objectFit: 'contain',
                  marginBottom: '16px',
                  display: 'inline-block',
                  filter: 'drop-shadow(0 4px 16px rgba(99, 102, 241, 0.35))'
                }}
              />
              <h1>Reset Your Password</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                Enter your email address and we'll send you recovery instructions.
              </p>
            </div>

            {forgotSuccessMsg ? (
              <div style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                color: '#4ade80',
                fontSize: '0.88rem',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                ✓ {forgotSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} style={{ textAlign: 'left' }}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={forgotLoading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.98rem',
                    fontWeight: '600',
                    marginTop: '8px',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  {forgotLoading ? "Sending Instructions..." : "Send Reset Link"}
                </button>
              </form>
            )}

            <div className="auth-footer">
              <button
                type="button"
                className="auth-link-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onClick={() => setAuthMode('login')}
              >
                <ArrowLeft size={14} /> Back to Log In
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isInitialLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0b0f19',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <img
          src="/shantidm-logo.png"
          alt="ShantiDM"
          style={{
            height: '52px',
            maxWidth: '220px',
            objectFit: 'contain',
            marginBottom: '24px',
            filter: 'drop-shadow(0 4px 18px rgba(99, 102, 241, 0.45))'
          }}
        />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#94a3b8',
          fontSize: '0.95rem',
          fontWeight: 500
        }}>
          <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', color: '#6366f1' }} />
          <span>Loading workspace...</span>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map(t => (
          <div key={t.id} className="toast" style={{
            borderLeft: `6px solid ${t.type === 'success' ? 'var(--success)' : t.type === 'warning' ? 'var(--warning)' : t.type === 'error' ? 'var(--error)' : 'var(--primary)'}`
          }}>
            {t.type === 'warning' && <AlertTriangle size={18} className="text-warning" />}
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Comments & Replies Modal Overlay */}
      {activeCommentsPost && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card" style={{
            width: '90%',
            maxWidth: '750px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            overflow: 'hidden',
            backgroundColor: '#11131c',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5), 0 10px 10px -5px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Comments Thread</h2>
              <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => setActiveCommentsPost(null)}>Close</button>
            </div>

            {/* Post Snippet */}
            <div style={{ display: 'flex', gap: '16px', backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <PostPreviewMedia post={activeCommentsPost} variant="compact" showBadge={false} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeCommentsPost.caption || "No caption"}
                </p>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Posted on {formatDateIST(activeCommentsPost.timestamp || activeCommentsPost.created_time || activeCommentsPost.created_at)}
                </span>
              </div>
            </div>

            {/* Comments Thread Area */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
              {isFetchingComments ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>Loading comments...</div>
              ) : postComments.filter(c => !c.parent_id).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No comments on this post yet.</div>
              ) : (
                postComments.filter(c => !c.parent_id).map(parentComment => {
                  const replies = postComments.filter(r => r.parent_id === parentComment.id);
                  return (
                    <div key={parentComment.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* Parent Comment */}
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontWeight: 600,
                          color: 'var(--primary)',
                          fontSize: '0.8rem'
                        }}>
                          {parentComment.username ? parentComment.username.slice(0, 2).toUpperCase() : 'IG'}
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <strong style={{ fontSize: '0.85rem' }}>@{parentComment.username || 'user'}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(parentComment.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{parentComment.text}</p>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', gap: '12px' }}>
                            <button
                              onClick={() => setReplyingToCommentId(replyingToCommentId === parentComment.id ? null : parentComment.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary)',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              Reply
                            </button>
                            <button
                              onClick={() => handleDeleteComment(parentComment.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--error)',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Replies Thread */}
                      {replies.map(reply => (
                        <div key={reply.id} style={{ display: 'flex', gap: '12px', marginLeft: '44px', alignItems: 'flex-start' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 600,
                            color: 'var(--success)',
                            fontSize: '0.75rem'
                          }}>
                            {reply.username ? reply.username.slice(0, 2).toUpperCase() : 'IG'}
                          </div>
                          <div style={{ flex: 1, backgroundColor: 'rgba(16, 185, 129, 0.03)', padding: '10px 12px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <strong style={{ fontSize: '0.8rem' }}>@{reply.username || 'user'}</strong>
                                <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Bot Reply</span>
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {new Date(reply.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{reply.text}</p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                              <button
                                onClick={() => handleDeleteComment(reply.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--error)',
                                  fontSize: '0.72rem',
                                  cursor: 'pointer',
                                  fontWeight: 500
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Inline Reply Form */}
                      {replyingToCommentId === parentComment.id && (
                        <div style={{ marginLeft: '44px', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={newReplyText}
                            onChange={(e) => setNewReplyText(e.target.value)}
                            style={{
                              flex: 1,
                              backgroundColor: 'rgba(255,255,255,0.04)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              color: 'white',
                              fontSize: '0.8rem'
                            }}
                          />
                          <button
                            onClick={() => handleAddReply(parentComment.id)}
                            className="btn btn-primary"
                            style={{ padding: '8px 12px', fontSize: '0.75rem' }}
                            disabled={isSubmittingReply}
                          >
                            {isSubmittingReply ? "..." : "Send"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Top-level Comment Form */}
            <form onSubmit={handleAddComment} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Write a public comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: 'white',
                  fontSize: '0.88rem'
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '10px 20px' }}
                disabled={isSubmittingComment}
              >
                {isSubmittingComment ? "Posting..." : "Post Comment"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar navigation */}
      <div className="sidebar">
        <div className="logo-section" onClick={() => handleNavigateTab(hasConnectedAccount ? 'dashboard' : 'accounts')}>
          <img
            src="/shantidm-logo.png"
            alt="ShantiDM"
            className="main-logo-img"
          />
        </div>

        <div className="sidebar-nav">
          <div className={`nav-item ${activeTab === 'accounts' ? 'active' : ''}`} onClick={() => setActiveTab('accounts')}>
            <Link2 size={18} /> Linked accounts
            {!hasConnectedAccount && (
              <span
                style={{
                  marginLeft: 'auto',
                  background: 'rgba(99, 102, 241, 0.22)',
                  color: '#c7d2fe',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  borderRadius: '999px',
                  padding: '2px 9px',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}
              >
                Start here
              </span>
            )}
          </div>

          {!hasConnectedAccount ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0 6px 12px', fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>
              <span>Unlocks after you connect</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
            </div>
          ) : (
            <div style={{ margin: '14px 0 4px 16px', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Features
            </div>
          )}

          <div
            className={`nav-item ${activeTab === 'posts' ? 'active' : ''} ${!hasConnectedAccount ? 'nav-item-dimmed' : ''}`}
            onClick={() => handleNavigateTab('posts')}
            title={!hasConnectedAccount ? "Connect Meta to unlock this" : ""}
          >
            <FileText size={18} /> Media &amp; feed
          </div>

          <div
            className={`nav-item ${activeTab === 'post_flows' ? 'active' : ''} ${!hasConnectedAccount ? 'nav-item-dimmed' : ''}`}
            onClick={() => handleNavigateTab('post_flows')}
            title={!hasConnectedAccount ? "Connect Meta to unlock this" : ""}
          >
            <Link2 size={18} /> Post-specific flow
          </div>

          <div
            className={`nav-item ${activeTab === 'future_flows' ? 'active' : ''} ${!hasConnectedAccount ? 'nav-item-dimmed' : ''}`}
            onClick={() => handleNavigateTab('future_flows')}
            title={!hasConnectedAccount ? "Connect Meta to unlock this" : ""}
          >
            <Clock size={18} /> Future post
          </div>

          <div
            className={`nav-item ${activeTab === 'flows' ? 'active' : ''} ${!hasConnectedAccount ? 'nav-item-dimmed' : ''}`}
            onClick={() => handleNavigateTab('flows')}
            title={!hasConnectedAccount ? "Connect Meta to unlock this" : ""}
          >
            <GitFork size={18} /> All automation flows
          </div>

          <div
            className={`nav-item ${activeTab === 'comments' ? 'active' : ''} ${!hasConnectedAccount ? 'nav-item-dimmed' : ''}`}
            onClick={() => handleNavigateTab('comments')}
            title={!hasConnectedAccount ? "Connect Meta to unlock this" : ""}
          >
            <MessageSquare size={18} /> Comments history
          </div>

          <div
            className={`nav-item ${activeTab === 'dms' ? 'active' : ''} ${!hasConnectedAccount ? 'nav-item-dimmed' : ''}`}
            onClick={() => handleNavigateTab('dms')}
            title={!hasConnectedAccount ? "Connect Meta to unlock this" : ""}
          >
            <MessageCircle size={18} /> Personal DMs
          </div>

          <div
            className={`nav-item ${activeTab === 'logs' ? 'active' : ''} ${!hasConnectedAccount ? 'nav-item-dimmed' : ''}`}
            onClick={() => handleNavigateTab('logs')}
            title={!hasConnectedAccount ? "Connect Meta to unlock this" : ""}
          >
            <History size={18} /> Automation activity
          </div>
        </div>

        <div className="sidebar-footer">
          {demoMode && (
            <div style={{
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '6px',
              padding: '10px',
              marginBottom: '16px',
              fontSize: '0.78rem',
              color: 'var(--warning)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <AlertTriangle size={14} /> Running in Demo Mode
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="user-badge" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {accounts && accounts.length > 0 ? (
                <>
                  {/* Avatar with Instagram platform badge */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={
                        accounts[0].profile_picture_url ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={accounts[0].username}
                      className="user-avatar"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1.5px solid #e1306c',
                        flexShrink: 0,
                        display: 'block'
                      }}
                    />
                    {/* Instagram icon badge */}
                    <div style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1.5px solid #0d0d15',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.4)'
                    }}>
                      <svg viewBox="0 0 24 24" width="9" height="9" fill="white">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </div>
                  </div>
                  <div className="user-info" style={{ minWidth: 0, overflow: 'hidden' }}>
                    <span
                      className="user-name"
                      title={`@${accounts[0].username}`}
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: '600',
                        color: '#ffffff',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block'
                      }}
                    >
                      @{accounts[0].username}
                    </span>
                  </div>
                </>
              ) : facebookAccounts && facebookAccounts.length > 0 ? (
                <>
                  {/* Avatar with Facebook platform badge */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={
                        facebookAccounts[0].profile_picture_url ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={facebookAccounts[0].name}
                      className="user-avatar"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1.5px solid #1877f2',
                        flexShrink: 0,
                        display: 'block'
                      }}
                    />
                    {/* Facebook icon badge */}
                    <div style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      background: '#1877f2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1.5px solid #0d0d15',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.4)'
                    }}>
                      <svg viewBox="0 0 24 24" width="9" height="9" fill="white">
                        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                      </svg>
                    </div>
                  </div>
                  <div className="user-info" style={{ minWidth: 0, overflow: 'hidden' }}>
                    <span
                      className="user-name"
                      title={facebookAccounts[0].username ? `@${facebookAccounts[0].username}` : facebookAccounts[0].name}
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: '600',
                        color: '#ffffff',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block'
                      }}
                    >
                      {facebookAccounts[0].username ? `@${facebookAccounts[0].username}` : facebookAccounts[0].name}
                    </span>
                  </div>
                </>
              ) : (
                <div
                  onClick={() => setActiveTab('accounts')}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                  title="Connect Meta account"
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1px dashed rgba(255, 255, 255, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748b',
                      flexShrink: 0
                    }}
                  >
                    <Plus size={14} />
                  </div>
                  <div className="user-info" style={{ minWidth: 0, overflow: 'hidden' }}>
                    <span className="user-name" style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 500 }}>
                      No account linked
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: 'var(--error)',
                backgroundColor: 'rgba(239, 68, 68, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
              }}
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Sticky Navigation Header */}
        <div style={{
          position: 'sticky',
          top: '-40px',
          zIndex: 100,
          background: '#0d0d15',
          borderBottom: '1px solid var(--border-color)',
          margin: '-40px -40px 32px -40px',
          padding: '0'
        }}>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          {/* Main Header Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '32px',
            padding: '16px 32px'
          }}>
            <button
              onClick={() => handleNavigateTab('dashboard')}
              title={!hasConnectedAccount ? "Connect Meta to unlock this" : ""}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'dashboard' ? '#007bff' : 'var(--text-secondary)',
                fontWeight: activeTab === 'dashboard' ? '700' : '500',
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '6px',
                transition: 'all 0.2s',
                opacity: !hasConnectedAccount ? 0.45 : 1
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Dashboard
            </button>

            <button
              onClick={() => handleNavigateTab('posts')}
              title={!hasConnectedAccount ? "Connect Meta to unlock this" : ""}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'posts' ? '#007bff' : 'var(--text-secondary)',
                fontWeight: activeTab === 'posts' ? '700' : '500',
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '6px',
                transition: 'all 0.2s',
                opacity: !hasConnectedAccount ? 0.45 : 1
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9"></rect>
                <rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect>
                <rect x="3" y="16" width="7" height="5"></rect>
              </svg>
              Posts &amp; Reels
              {((posts?.length || 0) + (facebookPosts?.length || 0)) > 0 && (
                <span style={{
                  backgroundColor: '#ff2d55',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  marginLeft: '4px'
                }}>
                  {(posts?.length || 0) + (facebookPosts?.length || 0)}
                </span>
              )}
            </button>

            {/* Features Dropdown Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsFeaturesDropdownOpen(!isFeaturesDropdownOpen)}
                title={!hasConnectedAccount ? "Connect Meta to unlock this" : ""}
                style={{
                  background: (activeTab === 'post_flows' || activeTab === 'future_flows' || activeTab === 'dms' || isFeaturesDropdownOpen) ? 'rgba(0, 123, 255, 0.12)' : 'none',
                  border: (activeTab === 'post_flows' || activeTab === 'future_flows' || activeTab === 'dms' || isFeaturesDropdownOpen) ? '1px solid rgba(0, 123, 255, 0.3)' : '1px solid transparent',
                  color: (activeTab === 'post_flows' || activeTab === 'future_flows' || activeTab === 'dms' || isFeaturesDropdownOpen) ? '#60a5fa' : 'var(--text-secondary)',
                  fontWeight: (activeTab === 'post_flows' || activeTab === 'future_flows' || activeTab === 'dms') ? '700' : '500',
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  opacity: !hasConnectedAccount ? 0.45 : 1
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                Features
                <span style={{ fontSize: '0.75rem', opacity: 0.8, transform: isFeaturesDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
              </button>

              {isFeaturesDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '230px',
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '12px',
                  padding: '8px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.65)',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  {[
                    { name: 'Future Flows', tab: 'future_flows', icon: <Clock size={16} color="#60a5fa" /> },
                    { name: 'Post-Specific Flow', tab: 'post_flows', icon: <Link2 size={16} color="#a855f7" /> },
                    { name: 'Personal DMs', tab: 'dms', icon: <MessageCircle size={16} color="#10b981" /> }
                  ].map((item) => {
                    const isActive = activeTab === item.tab;
                    return (
                      <div
                        key={item.tab}
                        onClick={() => {
                          handleNavigateTab(item.tab);
                          setIsFeaturesDropdownOpen(false);
                        }}
                        title={!hasConnectedAccount ? "Connect Meta to unlock this" : ""}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.88rem',
                          fontWeight: isActive ? '700' : '500',
                          color: isActive ? '#60a5fa' : '#e2e8f0',
                          backgroundColor: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {item.icon}
                        <span style={{ flex: 1 }}>{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sync Feed Bar (Only shown on Posts & Reels and Dashboard tabs) */}
          {(activeTab === 'posts' || activeTab === 'dashboard') && (
            <div style={{
              borderTop: '1px solid var(--border-color)',
              padding: '12px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <button
                onClick={handleSyncPosts}
                disabled={isSyncingPosts}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#007bff',
                  color: 'white',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: isSyncingPosts ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isSyncingPosts ? 0.7 : 1
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={isSyncingPosts ? { animation: 'spin 1s linear infinite' } : {}}
                >
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                </svg>
                Check for new posts
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {isSyncingPosts
                  ? "Syncing feed from platforms..."
                  : lastSyncedAt
                    ? `Last synced ${getRelativeTime(lastSyncedAt)}`
                    : "Last synced recently"}
              </span>
            </div>
          )}
        </div>


        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            {(() => {
              const postsReadyToSetup = [...posts, ...facebookPosts].filter(post => {
                if (skippedPostIds.includes(post.id)) return false;
                return getPostStatus(post) === 'Setup';
              });
              postsReadyToSetup.sort((a, b) => {
                const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                return dateB - dateA;
              });

              if (postsReadyToSetup.length === 0) return null;

              return (
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>
                      Ready to Setup
                    </h2>
                    <span style={{
                      backgroundColor: '#ff2d55',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '24px',
                      height: '20px'
                    }}>
                      {postsReadyToSetup.length}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 20px 0' }}>
                    AutoDM isn’t active on these posts yet
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '20px',
                    marginBottom: '20px'
                  }}>
                    {postsReadyToSetup.slice(0, 4).map(post => {
                      const isFb = checkIsFbPost(post);
                      return (
                        <div
                          key={post.id}
                          className="card"
                          style={{
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            minHeight: '390px'
                          }}
                        >
                          <PostPreviewMedia post={post} variant="card" />

                          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <p style={{
                                fontSize: '0.88rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                lineHeight: '1.4',
                                margin: '0 0 6px 0',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {post.caption || "No caption"}
                              </p>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>
                                {getRelativeTime(post.timestamp)}
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: 'auto' }}>
                              <button
                                onClick={() => handleOpenVisualFlowForPost(post)}
                                className="btn btn-primary"
                                style={{
                                  flex: 1,
                                  padding: '8px 12px',
                                  fontSize: '0.8rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  margin: 0
                                }}
                              >
                                <Link2 size={14} /> Setup
                              </button>
                              <button
                                onClick={() => setSkippedPostIds(prev => [...prev, post.id])}
                                className="btn btn-secondary"
                                style={{
                                  padding: '8px 12px',
                                  fontSize: '0.8rem',
                                  margin: 0,
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  color: 'var(--text-secondary)'
                                }}
                              >
                                Skip
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button
                      onClick={() => setActiveTab('posts')}
                      className="btn btn-secondary"
                      style={{ padding: '8px 24px', fontSize: '0.85rem' }}
                    >
                      View All
                    </button>
                  </div>
                </div>
              );
            })()}

            <div className="stats-grid">
              <div className="card stat-card">
                <div className="stat-header">
                  <span>Total Ingested</span>
                  <MessageSquare size={20} className="text-secondary" />
                </div>
                <span className="stat-value" style={{ color: '#3b82f6' }}>{analytics.total_comments}</span>
                <span className="stat-label">Comments logged by Meta webhooks</span>
              </div>
              <div className="card stat-card">
                <div className="stat-header">
                  <span>Private DMs Sent</span>
                  <CheckCircle2 size={20} style={{ color: '#10b981' }} />
                </div>
                <span className="stat-value" style={{ color: '#10b981' }}>{analytics.dms_sent}</span>
                <span className="stat-label">Direct message links delivered</span>
              </div>
              <div className="card stat-card">
                <div className="stat-header">
                  <span>Public Replies</span>
                  <CheckCircle2 size={20} style={{ color: '#8b5cf6' }} />
                </div>
                <span className="stat-value" style={{ color: '#8b5cf6' }}>{analytics.replies_sent}</span>
                <span className="stat-label">Comment response threads created</span>
              </div>
              <div className="card stat-card">
                <div className="stat-header">
                  <span>Active Automations</span>
                  <Zap size={20} style={{ color: '#f59e0b' }} />
                </div>
                <span className="stat-value" style={{ color: '#f59e0b' }}>{flows.filter(f => f.is_active).length}</span>
                <span className="stat-label">Currently running flows</span>
              </div>
              <div className="card stat-card">
                <div className="stat-header">
                  <span>Paused Automations</span>
                  <PauseCircle size={20} style={{ color: '#6b7280' }} />
                </div>
                <span className="stat-value" style={{ color: '#6b7280' }}>{flows.filter(f => !f.is_active).length}</span>
                <span className="stat-label">Inactive flows</span>
              </div>
            </div>

            {/* Post Automation Status Table */}
            {(() => {
              const allPostItems = [...posts, ...facebookPosts].map(post => {
                const status = getPostStatus(post);
                return { post, status };
              });
              allPostItems.sort((a, b) => {
                const dateA = a.post.timestamp ? new Date(a.post.timestamp).getTime() : 0;
                const dateB = b.post.timestamp ? new Date(b.post.timestamp).getTime() : 0;
                return dateB - dateA;
              });

              // Filter by status tab selection
              let filteredTablePosts = allPostItems;
              if (postsFilterStatus !== 'All') {
                filteredTablePosts = allPostItems.filter(item => {
                  if (postsFilterStatus === 'Active') return item.status === 'Active';
                  if (postsFilterStatus === 'Setup') return item.status === 'Setup';
                  if (postsFilterStatus === 'Paused') return item.status === 'Paused';
                  return true;
                });
              }

              // Filter by search query
              if (postsSearchQuery.trim()) {
                const query = postsSearchQuery.toLowerCase();
                filteredTablePosts = filteredTablePosts.filter(item => {
                  const captionMatch = item.post.caption?.toLowerCase().includes(query);
                  const keywordMatch = item.post.keyword?.toLowerCase().includes(query);
                  return captionMatch || keywordMatch;
                });
              }

              return (
                <div className="card" style={{ padding: '24px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  {/* Table Controls (Filters, Search, Export) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['All', 'Active', 'Setup', 'Paused'].map(statusOpt => (
                        <button
                          key={statusOpt}
                          onClick={() => setPostsFilterStatus(statusOpt)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            border: postsFilterStatus === statusOpt ? '1px solid #007bff' : '1px solid var(--border-color)',
                            backgroundColor: postsFilterStatus === statusOpt ? '#007bff' : 'transparent',
                            color: postsFilterStatus === statusOpt ? 'white' : 'var(--text-secondary)'
                          }}
                        >
                          {statusOpt}
                        </button>
                      ))}
                    </div>

                    {/* Search & Export */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Search post captions and keywords"
                        value={postsSearchQuery}
                        onChange={(e) => setPostsSearchQuery(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'rgba(255,255,255,0.02)',
                          color: 'var(--text-primary)',
                          fontSize: '0.88rem',
                          width: '280px',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => {
                          const csvRows = [
                            ['Post ID', 'Caption', 'Status', 'Sent', 'Open', 'Clicks', 'CTR']
                          ];
                          filteredTablePosts.forEach(item => {
                            const stats = getPostStats(item.post);
                            csvRows.push([
                              item.post.id,
                              item.post.caption ? item.post.caption.replace(/"/g, '""') : 'No Caption',
                              item.status,
                              stats.sent,
                              stats.open,
                              stats.clicks,
                              stats.ctr
                            ]);
                          });
                          const csvContent = "data:text/csv;charset=utf-8,"
                            + csvRows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");
                          const encodedUri = encodeURI(csvContent);
                          const link = document.createElement("a");
                          link.setAttribute("href", encodedUri);
                          link.setAttribute("download", `post_automations_${postsFilterStatus.toLowerCase()}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        style={{
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'transparent',
                          color: '#007bff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Export to CSV"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Header Title */}
                  <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {postsFilterStatus} Posts
                    </h3>
                  </div>

                  {/* Table Container */}
                  <div className="table-container" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <th style={{ padding: '12px 16px' }}>POST</th>
                          <th style={{ padding: '12px 16px' }}>STATUS</th>
                          <th style={{ padding: '12px 16px', textAlign: 'center' }}>SENT</th>
                          <th style={{ padding: '12px 16px', textAlign: 'center' }}>OPEN</th>
                          <th style={{ padding: '12px 16px', textAlign: 'center' }}>CLICKS</th>
                          <th style={{ padding: '12px 16px', textAlign: 'center' }}>CTR</th>
                          <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTablePosts.length === 0 ? (
                          <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                              No matching posts found.
                            </td>
                          </tr>
                        ) : (
                          filteredTablePosts.map(item => {
                            const { post, status } = item;
                            const isFb = checkIsFbPost(post);
                            const stats = getPostStats(post);

                            return (
                              <tr key={post.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem', transition: 'background-color 0.2s' }}>
                                {/* POST details */}
                                <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <PostPreviewMedia post={post} variant="table" showBadge={false} />
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {!isFb ? (
                                      <div style={{
                                        width: '18px',
                                        height: '18px',
                                        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        flexShrink: 0
                                      }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                        </svg>
                                      </div>
                                    ) : (
                                      <div style={{
                                        width: '18px',
                                        height: '18px',
                                        backgroundColor: '#1877f2',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        flexShrink: 0
                                      }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                        </svg>
                                      </div>
                                    )}
                                    <span style={{
                                      fontWeight: '600',
                                      color: 'var(--text-primary)',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      maxWidth: '220px'
                                    }}>
                                      {post.caption || "No caption"}
                                    </span>
                                  </div>
                                </td>

                                {/* STATUS Badge */}
                                <td style={{ padding: '12px 16px' }}>
                                  {status === 'Active' && (
                                    <span style={{
                                      backgroundColor: 'rgba(40, 167, 69, 0.1)',
                                      border: '1px solid #28a745',
                                      color: '#28a745',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.75rem',
                                      fontWeight: '700'
                                    }}>
                                      Active
                                    </span>
                                  )}
                                  {status === 'Setup' && (
                                    <span
                                      onClick={() => handleOpenVisualFlowForPost(post)}
                                      title="Click to setup automation flow for this post"
                                      style={{
                                        backgroundColor: 'rgba(255, 45, 85, 0.15)',
                                        border: '1px solid #ff2d55',
                                        color: '#ff2d55',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        transition: 'all 0.2s'
                                      }}
                                    >
                                      ⚡ Setup
                                    </span>
                                  )}
                                  {status === 'Paused' && (
                                    <span style={{
                                      backgroundColor: 'rgba(108, 117, 125, 0.1)',
                                      border: '1px solid #6c757d',
                                      color: '#6c757d',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.75rem',
                                      fontWeight: '700'
                                    }}>
                                      Paused
                                    </span>
                                  )}
                                </td>

                                {/* SENT */}
                                <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                  {stats.sent}
                                </td>

                                {/* OPEN */}
                                <td style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                  {stats.open}
                                </td>

                                {/* CLICKS */}
                                <td style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                  {stats.clicks}
                                </td>

                                {/* CTR */}
                                <td style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: '600' }}>
                                  {stats.ctr}
                                </td>

                                {/* ACTIONS */}
                                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                                    <button
                                      onClick={() => handleOpenVisualFlowForPost(post)}
                                      style={{
                                        padding: '4px 10px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        backgroundColor: status === 'Setup' ? '#007bff' : '#495057',
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                      }}
                                    >
                                      {status === 'Setup' ? '⚡ Setup' : 'Edit'}
                                    </button>
                                    {status !== 'Setup' && (
                                      <button
                                        onClick={() => handleTogglePostAutomation(post)}
                                        style={{
                                          padding: '4px 8px',
                                          borderRadius: '4px',
                                          border: 'none',
                                          backgroundColor: '#495057',
                                          color: 'white',
                                          fontSize: '0.75rem',
                                          fontWeight: '600',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        {status === 'Active' ? 'Pause' : 'Resume'}
                                      </button>
                                    )}
                                    {status !== 'Setup' && (
                                      <button
                                        onClick={() => {
                                          requestConfirmation({
                                            title: "Remove Post Automation",
                                            message: "Are you sure you want to remove automation for this post?",
                                            confirmText: "Remove Automation",
                                            variant: "danger",
                                            onConfirm: () => handleRemovePostAutomation(post)
                                          });
                                        }}
                                        style={{
                                          padding: '4px 8px',
                                          borderRadius: '4px',
                                          border: 'none',
                                          backgroundColor: '#dc3545',
                                          color: 'white',
                                          fontSize: '0.75rem',
                                          fontWeight: '600',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            <div className="card">
              <div className="section-title">
                <TrendingUp size={20} style={{ color: 'var(--accent)' }} /> Keyword Performance metrics
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Keyword Trigger</th>
                      <th>Matches Logged</th>
                      <th>Status</th>
                      <th>Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(analytics.keyword_counts).length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No matches recorded yet.</td>
                      </tr>
                    ) : (
                      Object.entries(analytics.keyword_counts).map(([kw, count]) => (
                        <tr key={kw}>
                          <td><span className="keyword-tag">{kw}</span></td>
                          <td><strong>{count}</strong></td>
                          <td><span className="badge badge-success">active</span></td>
                          <td>{count > 0 ? '100.0%' : '0.0%'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Linked Accounts */}
        {activeTab === 'accounts' && (
          <div>
            {/* Page Header */}
            <div className="page-header" style={{ marginBottom: '28px' }}>
              <div className="header-title">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>Meta connected accounts</h1>
                <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: 0 }}>Manage the Facebook Pages and Instagram Business accounts linked to ShantiDM.</p>
              </div>
            </div>

            {hasConnectedAccount ? (
              /* Connected View: Show both connected Instagram profile and Facebook Page sections */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '32px' }}>
                {/* Instagram Connected Account Section */}
                <div>
                  <h2 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-success" style={{ padding: '4px 8px' }}>Instagram</span> Connected Channel
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {accounts && accounts.length > 0 ? (
                      accounts.map((acc) => (
                        <div key={acc.id} className="card connected-profile-card">
                          {/* Left Side: Profile Picture + Username + Info */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
                            <div className="profile-avatar-wrap">
                              {acc.profile_picture_url ? (
                                <img
                                  src={acc.profile_picture_url}
                                  alt={acc.username || acc.name}
                                  className="profile-avatar-img"
                                />
                              ) : (
                                <div className="profile-avatar-icon">
                                  <InstagramIcon size={38} style={{ color: '#ffffff' }} />
                                </div>
                              )}
                              <div
                                style={{
                                  position: 'absolute',
                                  bottom: '3px',
                                  right: '3px',
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '50%',
                                  backgroundColor: '#10b981',
                                  border: '2.5px solid #12131e',
                                  boxShadow: '0 0 10px #10b981'
                                }}
                                title="Active & Connected"
                              />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.3px' }}>
                                  @{acc.username}
                                </h2>
                                <span className="status-pill-badge connected" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>
                                  <span className="status-pulse-dot connected"></span>
                                  Connected &amp; Active
                                </span>
                              </div>

                              {acc.name && (
                                <div style={{ fontSize: '0.95rem', color: '#cbd5e1', fontWeight: '500' }}>
                                  {acc.name}
                                </div>
                              )}

                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#94a3b8' }}>
                                {acc.page_name && (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FacebookIcon size={15} /> Linked Facebook Page: <strong style={{ color: '#f1f5f9' }}>{acc.page_name}</strong>
                                  </span>
                                )}
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                                  <Zap size={14} /> AutoDM Automation Ready
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Side: Quick Actions */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleFacebookConnect('reauthenticate')}
                              disabled={isConnectingFB}
                              style={{ fontSize: '0.86rem', padding: '8px 18px' }}
                              title="Re-authenticate permissions with Meta"
                            >
                              <RefreshCw size={14} /> Re-authenticate
                            </button>
                            <button
                              className="btn btn-secondary"
                              style={{ fontSize: '0.86rem', padding: '8px 18px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.35)' }}
                              onClick={() => handleDisconnectInstagram(acc.id)}
                            >
                              Disconnect
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="card" style={{ padding: '24px', color: 'var(--text-secondary)', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)' }}>
                        <InstagramIcon size={28} style={{ color: 'var(--text-muted)', marginBottom: '6px' }} />
                        <p style={{ margin: 0, fontWeight: '500', color: '#cbd5e1' }}>No connected Instagram Business Account</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Facebook Connected Page Section */}
                <div>
                  <h2 className="section-title" style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-primary" style={{ padding: '4px 8px' }}>Facebook</span> Connected Page
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {facebookAccounts && facebookAccounts.length > 0 ? (
                      facebookAccounts.map((fbAcc) => (
                        <div
                          key={fbAcc.id}
                          className="card connected-profile-card"
                          style={{
                            background: 'linear-gradient(135deg, rgba(24, 119, 242, 0.08) 0%, rgba(18, 19, 30, 0.95) 100%)',
                            border: '1px solid rgba(24, 119, 242, 0.35)'
                          }}
                        >
                          {/* Left Side: Page Avatar + Name + Details */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
                            <div className="profile-avatar-wrap">
                              {fbAcc.profile_picture_url ? (
                                <img
                                  src={fbAcc.profile_picture_url}
                                  alt={fbAcc.name}
                                  className="profile-avatar-img"
                                  style={{
                                    borderColor: '#1877f2',
                                    boxShadow: '0 4px 16px rgba(24, 119, 242, 0.45)'
                                  }}
                                />
                              ) : (
                                <div
                                  className="profile-avatar-icon"
                                  style={{
                                    background: 'linear-gradient(135deg, #1877f2, #0d65d9)',
                                    boxShadow: '0 4px 16px rgba(24, 119, 242, 0.45)'
                                  }}
                                >
                                  <FacebookIcon size={38} />
                                </div>
                              )}
                              <div
                                style={{
                                  position: 'absolute',
                                  bottom: '3px',
                                  right: '3px',
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '50%',
                                  backgroundColor: '#10b981',
                                  border: '2.5px solid #12131e',
                                  boxShadow: '0 0 10px #10b981'
                                }}
                                title="Active & Connected"
                              />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.3px' }}>
                                  {fbAcc.name}
                                </h2>
                                <span className="status-pill-badge connected" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>
                                  <span className="status-pulse-dot connected"></span>
                                  Connected &amp; Verified
                                </span>
                              </div>

                              {fbAcc.username && (
                                <div style={{ fontSize: '0.95rem', color: '#cbd5e1', fontWeight: '500' }}>
                                  @{fbAcc.username}
                                </div>
                              )}

                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#94a3b8' }}>
                                <span>
                                  Facebook Page ID: <strong style={{ color: '#f1f5f9' }}>{fbAcc.facebook_page_id}</strong>
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa' }}>
                                  <Check size={14} /> Page Webhooks Active
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Side: Quick Actions */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleFacebookConnect('reauthenticate')}
                              disabled={isConnectingFB}
                              style={{ fontSize: '0.86rem', padding: '8px 18px' }}
                              title="Re-authenticate permissions with Meta"
                            >
                              <RefreshCw size={14} /> Re-authenticate
                            </button>
                            <button
                              className="btn btn-secondary"
                              style={{ fontSize: '0.86rem', padding: '8px 18px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.35)' }}
                              onClick={() => handleDisconnectFacebook(fbAcc.id)}
                            >
                              Disconnect
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="card" style={{ padding: '24px', color: 'var(--text-secondary)', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)' }}>
                        <FacebookIcon size={28} style={{ color: 'var(--text-muted)', marginBottom: '6px' }} />
                        <p style={{ margin: 0, fontWeight: '500', color: '#cbd5e1' }}>No connected Facebook Page</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Unconnected View: Show Modern Hero Card with Dashed Diagram and 3-Step Setup Prerequisites */
              <>
                {/* Hero Card matching user mockup */}
                <div style={{
                  background: '#0d1322',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '36px 40px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '32px',
                  marginBottom: '40px',
                  boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
                }}>
                  {/* Left Column: Status Pill, Heading, Text, Button, Link, and Short Note */}
                  <div style={{ flex: '1 1 440px', maxWidth: '600px' }}>
                    {/* Neutral Grey Status Pill */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      fontWeight: 500,
                      marginBottom: '18px'
                    }}>
                      <span style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: '#94a3b8',
                        display: 'inline-block'
                      }} />
                      Not connected
                    </div>

                    <h2 style={{
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      margin: '0 0 12px 0',
                      letterSpacing: '-0.3px',
                      lineHeight: 1.25
                    }}>
                      Connect Meta to start automating
                    </h2>

                    <p style={{
                      margin: '0 0 24px 0',
                      color: '#94a3b8',
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      maxWidth: '520px'
                    }}>
                      ShantiDM replies to comments and sends DMs on your Facebook Page and Instagram Business account. Connect once and every tool unlocks.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '14px' }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleFacebookConnect('default')}
                        disabled={isConnectingFB}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '11px 22px',
                          fontSize: '0.92rem',
                          fontWeight: 600,
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                          border: 'none',
                          color: '#ffffff',
                          cursor: isConnectingFB ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <Link2 size={16} />
                        {isConnectingFB ? "Connecting..." : "Connect Meta account"}
                      </button>

                      <a
                        href="#before-you-connect"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById('before-you-connect')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        style={{
                          color: '#cbd5e1',
                          fontSize: '0.88rem',
                          textDecoration: 'none',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
                      >
                        Need a Facebook Page first?
                      </a>
                    </div>

                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.82rem' }}>
                      You'll approve permissions on Meta, then return here.
                    </p>
                  </div>

                  {/* Right Column: Dashed Diagram (Facebook Page --- ShantiDM --- Instagram) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0px',
                    padding: '10px 0'
                  }}>
                    {/* Facebook Node */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '88px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        border: '1.5px dashed rgba(255, 255, 255, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 255, 255, 0.02)'
                      }}>
                        <FacebookIcon size={24} style={{ color: '#64748b' }} />
                      </div>
                      <span style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '10px', textAlign: 'center' }}>
                        Facebook Page
                      </span>
                    </div>

                    {/* Dashed Connecting Line */}
                    <div style={{
                      width: '42px',
                      height: '0',
                      borderTop: '1.5px dashed rgba(255, 255, 255, 0.22)',
                      marginBottom: '24px'
                    }} />

                    {/* ShantiDM Center Node */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '88px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)'
                      }}>
                        <MessageCircle size={28} color="#ffffff" />
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginTop: '10px', textAlign: 'center' }}>
                        ShantiDM
                      </span>
                    </div>

                    {/* Dashed Connecting Line */}
                    <div style={{
                      width: '42px',
                      height: '0',
                      borderTop: '1.5px dashed rgba(255, 255, 255, 0.22)',
                      marginBottom: '24px'
                    }} />

                    {/* Instagram Node */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '88px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        border: '1.5px dashed rgba(255, 255, 255, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 255, 255, 0.02)'
                      }}>
                        <InstagramIcon size={24} style={{ color: '#64748b' }} />
                      </div>
                      <span style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '10px', textAlign: 'center' }}>
                        Instagram
                      </span>
                    </div>
                  </div>
                </div>

                {/* Diagnostics Box ONLY when status is failed or action_required */}
                {metaConnectionStatus === 'failed' && (
                  <div className="meta-diagnostics-box border-red" style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: '700', fontSize: '0.88rem' }}>
                      <ShieldAlert size={16} /> Meta Error Diagnostics
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Server / Meta Response
                      </div>
                      <div className="meta-code-snippet">
                        {metaErrorMessage || "Meta OAuth failed to complete authorization."}
                      </div>
                    </div>
                    {metaErrorDetails && (
                      <div style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: '1.5' }}>
                        <strong>What to check:</strong> {metaErrorDetails}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.84rem', backgroundColor: '#ef4444', borderColor: '#ef4444' }}
                        onClick={() => handleFacebookConnect('default')}
                        disabled={isConnectingFB}
                      >
                        <RefreshCw size={14} /> Try Connecting Again
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                        onClick={() => {
                          setMetaConnectionStatus('not_connected');
                          setMetaErrorMessage('');
                          setMetaErrorDetails('');
                          setMetaErrorType('');
                        }}
                      >
                        Dismiss Error
                      </button>
                    </div>
                  </div>
                )}

                {metaConnectionStatus === 'action_required' && (
                  <div className="meta-diagnostics-box border-orange" style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb923c', fontWeight: '700', fontSize: '0.88rem' }}>
                      <AlertTriangle size={16} /> Required Action Before Connecting
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Issue Detected
                      </div>
                      <div className="meta-code-snippet" style={{ color: '#fed7aa', borderColor: 'rgba(249, 115, 22, 0.3)' }}>
                        {metaErrorMessage || "No Instagram Business account linked to Facebook Page"}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.86rem', color: '#f1f5f9', lineHeight: '1.6' }}>
                      <strong>Please complete this checklist:</strong>
                      <ol style={{ margin: '6px 0 0 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px', color: '#cbd5e1' }}>
                        <li>
                          <strong>Professional Account:</strong> Ensure your Instagram account is switched to <strong>Creator</strong> or <strong>Business</strong> in Instagram Settings &gt; Account Type.
                        </li>
                        <li>
                          <strong>Facebook Page Link:</strong> Open your <strong>Facebook Page Settings &gt; Linked Accounts &gt; Instagram</strong> and confirm your Instagram account is linked.
                        </li>
                        <li>
                          <strong>Select Page in Meta Popup:</strong> In the Meta authorization dialog, make sure your Facebook Page is selected and all requested permissions are approved.
                        </li>
                      </ol>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.84rem', background: 'linear-gradient(90deg, #f97316, #ea580c)', borderColor: '#f97316' }}
                        onClick={() => handleFacebookConnect('reauthenticate')}
                        disabled={isConnectingFB}
                      >
                        <RefreshCw size={14} /> Retry with Full Permissions
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                        onClick={() => {
                          setMetaConnectionStatus('not_connected');
                          setMetaErrorMessage('');
                          setMetaErrorDetails('');
                          setMetaErrorType('');
                        }}
                      >
                        Clear &amp; Start Over
                      </button>
                    </div>
                  </div>
                )}

                {/* Before You Connect Section */}
                <div id="before-you-connect" style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#ffffff' }}>
                      Before you connect
                    </h2>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      Instagram needs to be a Professional account linked to a Facebook Page.
                    </span>
                  </div>

                  {/* 3 Prerequisite Cards Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px'
                  }}>
                    {/* Card 1: Create a Facebook Page */}
                    <div style={{
                      background: '#0d1322',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '24px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.86rem',
                          color: '#cbd5e1',
                          flexShrink: 0
                        }}>
                          1
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 600, color: '#ffffff' }}>
                          Create a Facebook Page
                        </h3>
                      </div>

                      <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                        Skip if you already have one
                      </div>

                      <ul style={{
                        margin: 0,
                        paddingLeft: '18px',
                        color: '#94a3b8',
                        fontSize: '0.86rem',
                        lineHeight: 1.8,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3px'
                      }}>
                        <li>Log in to Facebook.</li>
                        <li>Go to <strong style={{ color: '#cbd5e1' }}>Pages</strong> and click <strong style={{ color: '#cbd5e1' }}>Create New Page</strong>.</li>
                        <li>Enter your Page name and details.</li>
                        <li>Finish creating the Page.</li>
                      </ul>
                    </div>

                    {/* Card 2: Link Instagram to the Page */}
                    <div style={{
                      background: '#0d1322',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '24px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.86rem',
                          color: '#cbd5e1',
                          flexShrink: 0
                        }}>
                          2
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 600, color: '#ffffff' }}>
                          Link Instagram to the Page
                        </h3>
                      </div>

                      <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                        Skip if already linked
                      </div>

                      <ul style={{
                        margin: 0,
                        paddingLeft: '18px',
                        color: '#94a3b8',
                        fontSize: '0.86rem',
                        lineHeight: 1.8,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3px'
                      }}>
                        <li>Switch Instagram to <strong style={{ color: '#cbd5e1' }}>Professional</strong> (Creator or Business).</li>
                        <li>Open your <strong style={{ color: '#cbd5e1' }}>Facebook Page</strong>.</li>
                        <li>Go to <strong style={{ color: '#cbd5e1' }}>Settings › Linked accounts</strong>.</li>
                        <li>Choose <strong style={{ color: '#cbd5e1' }}>Instagram › Connect account</strong>.</li>
                      </ul>
                    </div>

                    {/* Card 3: Connect to ShantiDM (Highlighted with violet border) */}
                    <div style={{
                      background: '#0e142c',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      borderRadius: '16px',
                      padding: '24px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.12)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.86rem',
                          color: '#ffffff',
                          flexShrink: 0
                        }}>
                          3
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 600, color: '#ffffff' }}>
                          Connect to ShantiDM
                        </h3>
                      </div>

                      <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
                        Do this after steps 1 and 2
                      </div>

                      <ul style={{
                        margin: 0,
                        paddingLeft: '18px',
                        color: '#cbd5e1',
                        fontSize: '0.86rem',
                        lineHeight: 1.8,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3px'
                      }}>
                        <li>Click <strong style={{ color: '#ffffff' }}>Connect Meta account</strong> above.</li>
                        <li>Choose your Facebook Page and Instagram profile.</li>
                        <li>Approve the automation permissions.</li>
                        <li>Your account connects and every tool unlocks.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 4. Demo Mode Testing Bar (for manual inspection of all 4 connection statuses) */}
            {demoMode && (
              <div style={{
                marginTop: '36px',
                padding: '16px 20px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px dashed rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  <strong style={{ color: '#ffffff' }}>🧪 Demo Status Simulator:</strong> Preview all 4 Meta connection statuses:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '5px 10px', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                    onClick={() => {
                      if (accounts.length === 0) {
                        setAccounts([{
                          id: 901,
                          instagram_business_account_id: "1784140001",
                          username: "shanti_automation",
                          name: "Shanti Social Growth",
                          profile_picture_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                          page_name: "Shanti Official Page"
                        }]);
                        setFacebookAccounts([{
                          id: 902,
                          facebook_page_id: "fb_page_1001",
                          username: "shantiofficial",
                          name: "Shanti Official Page",
                          profile_picture_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                        }]);
                      }
                      setMetaConnectionStatus('connected');
                      setMetaErrorMessage('');
                      setMetaErrorDetails('');
                      addToast("Previewing: Connected status", "success");
                    }}
                  >
                    🟢 Connected
                  </button>

                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '5px 10px', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                    onClick={() => {
                      setAccounts([]);
                      setFacebookAccounts([]);
                      setMetaConnectionStatus('not_connected');
                      setMetaErrorMessage('');
                      setMetaErrorDetails('');
                      addToast("Previewing: Not Connected status (New User Gating Active)", "warning");
                    }}
                  >
                    🟡 Not Connected
                  </button>

                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '5px 10px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                    onClick={() => {
                      setAccounts([]);
                      setFacebookAccounts([]);
                      setMetaConnectionStatus('failed');
                      setMetaErrorMessage("OAuthException (Code 190): Invalid OAuth access token - Cannot parse access token or signature expired.");
                      setMetaErrorDetails("Meta Graph API returned error code 190. The user token expired or app secret verification failed. Please re-authenticate.");
                      addToast("Previewing: Connection Failed status", "error");
                    }}
                  >
                    🔴 Connection Failed
                  </button>

                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '5px 10px', color: '#fb923c', borderColor: 'rgba(249, 115, 22, 0.4)' }}
                    onClick={() => {
                      setAccounts([]);
                      setFacebookAccounts([]);
                      setMetaConnectionStatus('action_required');
                      setMetaErrorMessage("No Instagram Business Accounts found connected to your Facebook Pages. Please verify page setup.");
                      setMetaErrorDetails("Meta could not discover an Instagram Professional (Creator or Business) account connected to your Facebook Page in Settings > Linked Accounts > Instagram.");
                      addToast("Previewing: Action Required status", "warning");
                    }}
                  >
                    🟠 Action Required
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Media & Feed */}
        {activeTab === 'posts' && (
          <div>
            <div className="page-header">
              <div className="header-title">
                <h1>Posts & Automations</h1>
                <p>Configure keyword-triggered comment replies and interactive DMs for specific posts.</p>
              </div>
            </div>


            {/* Platform Selector */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button
                onClick={() => { setPostsFilterPlatform('instagram'); setPostsFilter('all'); }}
                className={`btn ${postsFilterPlatform === 'instagram' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Instagram Accounts ({accounts.length})
              </button>
              <button
                onClick={() => { setPostsFilterPlatform('facebook'); setPostsFilter('all'); }}
                className={`btn ${postsFilterPlatform === 'facebook' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Facebook Pages ({facebookAccounts.length})
              </button>
            </div>

            {/* Specific Connected Account / Page Selector */}
            {postsFilterPlatform === 'instagram' && accounts.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Connected Account:</span>
                <button
                  onClick={() => setSelectedInstagramAccount('all')}
                  className={`btn ${selectedInstagramAccount === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '14px' }}
                >
                  All Instagram Accounts ({accounts.length})
                </button>
                {accounts.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => setSelectedInstagramAccount(acc.id)}
                    className={`btn ${String(selectedInstagramAccount) === String(acc.id) ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <InstagramIcon size={13} />
                    @{acc.username}
                  </button>
                ))}
              </div>
            )}

            {postsFilterPlatform === 'facebook' && facebookAccounts.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Connected Page:</span>
                <button
                  onClick={() => setSelectedFacebookAccount('all')}
                  className={`btn ${selectedFacebookAccount === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '14px' }}
                >
                  All Facebook Pages ({facebookAccounts.length})
                </button>
                {facebookAccounts.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => setSelectedFacebookAccount(acc.id)}
                    className={`btn ${String(selectedFacebookAccount) === String(acc.id) ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <FacebookIcon size={13} />
                    {acc.name}
                  </button>
                ))}
              </div>
            )}

            {/* Media Type & Automation Status Tabs */}
            {(() => {
              // Calculate scoped items for count tabs
              let scopedItems = postsFilterPlatform === 'instagram' ? posts : facebookPosts;
              if (postsFilterPlatform === 'instagram' && selectedInstagramAccount !== 'all') {
                scopedItems = scopedItems.filter(p => String(p.instagram_account_id) === String(selectedInstagramAccount));
              } else if (postsFilterPlatform === 'facebook' && selectedFacebookAccount !== 'all') {
                scopedItems = scopedItems.filter(p => String(p.facebook_account_id) === String(selectedFacebookAccount));
              }

              return (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '15px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  {/* Media Type Filter */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setPostsFilter('all')}
                      className={`btn ${postsFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      All Media ({scopedItems.length})
                    </button>
                    <button
                      onClick={() => setPostsFilter('reels')}
                      className={`btn ${postsFilter === 'reels' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      Reels / Videos ({scopedItems.filter(p => p.media_type === 'VIDEO' || p.media_type === 'video').length})
                    </button>
                  </div>

                  {/* Automation Status Tabs */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setPostsAutomationFilter('all')}
                      className={`btn ${postsAutomationFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      All Posts
                    </button>
                    <button
                      onClick={() => setPostsAutomationFilter('active')}
                      className={`btn ${postsAutomationFilter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      Active
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Posts Grid */}
            {(() => {
              let allItems = postsFilterPlatform === 'instagram' ? posts : facebookPosts;

              // Filter by Selected Connected Account
              if (postsFilterPlatform === 'instagram' && selectedInstagramAccount !== 'all') {
                allItems = allItems.filter(p => String(p.instagram_account_id) === String(selectedInstagramAccount));
              } else if (postsFilterPlatform === 'facebook' && selectedFacebookAccount !== 'all') {
                allItems = allItems.filter(p => String(p.facebook_account_id) === String(selectedFacebookAccount));
              }

              // 1. Filter by Media type
              let filtered = allItems.filter(post => {
                const isVideo = post.media_type === 'VIDEO' || post.media_type === 'video';
                if (postsFilter === 'reels') return isVideo;
                return true;
              });

              // 2. Filter by Automation status tab
              filtered = filtered.filter(post => {
                const status = (getPostStatus(post) || 'Setup').toLowerCase();
                if (postsAutomationFilter === 'all') return true;
                return status === postsAutomationFilter.toLowerCase();
              });

              // 3. Arrange posts by published date (most recent posts displayed first)
              filtered.sort((a, b) => {
                const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                return dateB - dateA;
              });

              if (allItems.length === 0) {
                return (
                  <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                    <p>No cached posts found. Link a {postsFilterPlatform === 'instagram' ? 'Instagram' : 'Facebook'} account and sync.</p>
                  </div>
                );
              }

              if (filtered.length === 0) {
                return (
                  <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                    <p>No posts matching the selected tab filters.</p>
                  </div>
                );
              }

              return (
                <div className="posts-grid">
                  {filtered.map(post => {
                    const isVideo = post.media_type === 'VIDEO' || post.media_type === 'video';
                    const status = getPostStatus(post);

                    return (
                      <div key={post.id} className="card post-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="post-media-container" style={{ position: 'relative' }}>
                          {isVideo ? (
                            <video
                              src={post.media_url}
                              poster={post.thumbnail_url || post.media_url}
                              controls
                              playsInline
                              preload="metadata"
                              className="post-img"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : post.media_url ? (
                            <img
                              src={post.media_url}
                              className="post-img"
                              alt="Media Feed"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="post-no-media" style={{
                              width: '100%',
                              height: '200px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'var(--card-bg-hover, #2a2b36)',
                              color: 'var(--text-secondary)',
                              fontSize: '0.85rem',
                              borderBottom: '1px solid var(--border-color)'
                            }}>
                              No Media Content
                            </div>
                          )}

                          {/* Automation Status Badge */}


                          {isVideo && !post.is_future_post && (
                            <div style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold'
                            }}>
                              VIDEO/REEL
                            </div>
                          )}
                        </div>
                        <div className="post-info" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            {(() => {
                              const isIg = postsFilterPlatform === 'instagram';
                              const accObj = isIg
                                ? accounts.find(a => a.id === post.instagram_account_id)
                                : facebookAccounts.find(a => a.id === post.facebook_account_id);
                              if (!accObj) return null;
                              return (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px', marginBottom: '8px', border: '1px solid var(--border-color)' }}>
                                  {isIg ? <InstagramIcon size={11} /> : <FacebookIcon size={11} />}
                                  <span>{isIg ? `@${accObj.username}` : accObj.name}</span>
                                </div>
                              );
                            })()}
                            <p className="post-caption" style={{ marginBottom: '12px' }}>{post.caption || "No caption"}</p>

                            {/* Automation Config Summary */}
                            {(post.keyword || post.reply_message || post.dm_message) && (
                              <div style={{
                                backgroundColor: 'rgba(255,255,255,0.02)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                padding: '10px',
                                marginBottom: '12px',
                                fontSize: '0.8rem'
                              }}>
                                {post.keyword && (
                                  <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>Trigger:</span>
                                    <span className="badge badge-accent" style={{ fontSize: '0.75rem', padding: '2px 6px' }}>{post.keyword}</span>
                                  </div>
                                )}
                                {post.reply_message && (
                                  <div style={{ marginBottom: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>Reply:</span> "{post.reply_message}"
                                  </div>
                                )}
                                {post.dm_message && (
                                  <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>DM:</span> "{post.dm_message.startsWith('{') ? 'Interactive Template' : post.dm_message}"
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="post-meta" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              <span>Date Published:</span>
                              <span style={{ fontWeight: 'bold' }}>
                                {formatDateIST(post.timestamp || post.created_time || post.created_at)}
                              </span>
                            </div>

                            <button
                              onClick={() => handleOpenVisualFlowForPost(post)}
                              className="btn btn-accent"
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                textTransform: 'none',
                                fontWeight: '600'
                              }}
                            >
                              ⚡ Setup Visual Flow
                            </button>

                            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                              {post.permalink && (
                                <a
                                  href={post.permalink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-primary"
                                  style={{
                                    flex: 1,
                                    padding: '6px 8px',
                                    fontSize: '0.75rem',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px',
                                    textTransform: 'none'
                                  }}
                                >
                                  🔗 Open Link
                                </a>
                              )}
                              <button
                                onClick={() => handleOpenComments(post)}
                                className="btn btn-secondary"
                                style={{
                                  flex: 1,
                                  padding: '6px 8px',
                                  fontSize: '0.75rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px',
                                  textTransform: 'none'
                                }}
                              >
                                💬 Comments
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

          </div>
        )}

        {/* Tab 4: Flow List */}
        {activeTab === 'flows' && (
          <div>
            <div className="page-header">
              <div className="header-title">
                <h1>Automation Flows</h1>
                <p>Design triggers and response chains for comments and DMs.</p>
              </div>
              <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => { setGuideTab('all'); setIsGuideOpen(true); }}
                >
                  <Info size={16} /> User Guide
                </button>

              </div>
            </div>

            <div className="flow-list">
              {flows.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                  <p>No automation flows created yet. Get started by creating your first flow.</p>
                </div>
              ) : (
                flows.map(flow => {
                  const matchedInsta = accounts.find(a => a.id === flow.instagram_account_id);
                  const matchedFb = facebookAccounts.find(a => a.id === flow.facebook_account_id);
                  const platformName = flow.facebook_account_id ? "Facebook" : "Instagram";
                  const accountName = matchedFb ? matchedFb.name : matchedInsta ? `@${matchedInsta.username}` : "Unlinked";
                  const linkedPostInfo = getFlowLinkedPost(flow);

                  return (
                    <div
                      key={flow.id}
                      className="card flow-item"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        padding: '20px',
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Flow Header Row */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                        borderBottom: linkedPostInfo ? '1px solid var(--border-color)' : 'none',
                        paddingBottom: linkedPostInfo ? '14px' : '0',
                        width: '100%',
                        minWidth: 0
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: '1 1 300px', minWidth: 0 }}>
                          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '600' }}>{flow.name}</h3>
                          <span className={`badge ${flow.facebook_account_id ? 'badge-primary' : 'badge-success'}`} style={{ fontSize: '0.68rem', padding: '2px 8px', whiteSpace: 'nowrap' }}>
                            {platformName} ({accountName})
                          </span>
                          <span className={`badge ${flow.is_active ? 'badge-success' : 'badge-secondary'}`} style={{ fontSize: '0.68rem', padding: '2px 8px', whiteSpace: 'nowrap' }}>
                            {flow.is_active ? '● Active' : '○ Paused'}
                          </span>
                          {flow.is_future_flow && (
                            <span className="badge" style={{
                              fontSize: '0.68rem',
                              padding: '2px 8px',
                              whiteSpace: 'nowrap',
                              background: flow.future_flow_status === 'resolved'
                                ? 'linear-gradient(135deg, #059669, #047857)'
                                : 'linear-gradient(135deg, #d97706, #b45309)',
                              color: 'white',
                              borderRadius: '4px',
                              fontWeight: '700',
                              letterSpacing: '0.2px'
                            }}>
                              {flow.future_flow_status === 'resolved' ? '✅ Future Flow (Resolved)' : '⏳ Future Flow (Awaiting)'}
                            </span>
                          )}

                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginLeft: '4px' }}>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Triggers:</span>
                            {flow.nodes
                              .filter(n => n.type === 'trigger')
                              .flatMap(n => n.config?.keywords || [])
                              .map(kw => (
                                <span key={kw} className="keyword-tag" style={{ fontSize: '0.72rem' }}>{kw}</span>
                              ))}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                          {/* Scan Now button for pending future flows */}
                          {flow.is_future_flow && flow.future_flow_status === 'pending' && (
                            <button
                              className={`btn ${scanningFlowId === flow.id ? 'btn-disabled' : 'btn-secondary'}`}
                              onClick={() => handleScanFutureFlow(flow.id)}
                              disabled={scanningFlowId !== null}
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', border: '1px solid #d97706', color: '#d97706' }}
                            >
                              {scanningFlowId === flow.id ? '🔄 Scanning...' : '🔍 Scan Now'}
                            </button>
                          )}
                          <button
                            className={`btn btn-accent ${runningFlowId === flow.id ? 'btn-disabled' : ''}`}
                            onClick={() => handleRunSingleFlow(flow.id)}
                            disabled={runningFlowId !== null}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
                          >
                            <Play size={14} />
                            {runningFlowId === flow.id ? "Running..." : "Run Flow"}
                          </button>
                          <button className="btn btn-secondary" style={{ fontSize: '0.82rem' }} onClick={() => handleOpenBuilder(flow)}>
                            Edit Visual Flow
                          </button>
                          <button className="btn btn-danger" style={{ padding: '8px 10px' }} onClick={() => handleDeleteFlow(flow.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Future Flow Awaiting Banner */}
                      {flow.is_future_flow && flow.future_flow_status === 'pending' && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '12px 16px',
                          background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08), rgba(180, 83, 9, 0.05))',
                          border: '1px solid rgba(217, 119, 6, 0.35)',
                          borderRadius: '10px',
                          width: '100%',
                          boxSizing: 'border-box',
                        }}>
                          <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>⏳</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                AWAITING POST PUBLICATION
                              </span>
                            </div>
                            {flow.future_post_caption && (
                              <p style={{ margin: '0 0 4px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                <strong style={{ color: '#e5e7eb' }}>Caption hint:</strong> "{flow.future_post_caption.slice(0, 80)}{flow.future_post_caption.length > 80 ? '...' : ''}"
                              </p>
                            )}
                            {flow.future_post_scheduled_at && (
                              <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                📅 Expected: {new Date(flow.future_post_scheduled_at).toLocaleString()}
                              </p>
                            )}
                            {flow.future_flow_last_scanned_at && (
                              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                🔍 Last scanned: {new Date(flow.future_flow_last_scanned_at).toLocaleString()}
                              </p>
                            )}
                            {!flow.future_flow_last_scanned_at && (
                              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                Auto-scan runs every 5 minutes. Click "Scan Now" to check immediately.
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Configured Post Banner (Full Width) */}
                      {linkedPostInfo && (
                        <div
                          onClick={() => handleOpenPostOnPlatform(linkedPostInfo)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            backgroundColor: 'rgba(255, 255, 255, 0.025)',
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                            borderRadius: '10px',
                            width: '100%',
                            boxSizing: 'border-box',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            minWidth: 0
                          }}
                          className="configured-post-banner"
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.borderColor = '#818cf8'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.025)'; e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)'; }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                            {linkedPostInfo.mediaUrl ? (
                              <img
                                src={linkedPostInfo.mediaUrl}
                                alt="Post thumbnail"
                                style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)', flexShrink: 0 }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#1a1b26', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#9ca3af', flexShrink: 0 }}>
                                📷
                              </div>
                            )}
                            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                                  📌 CONFIGURED POST
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                  ID: {linkedPostInfo.postId}
                                </span>
                                {linkedPostInfo.timestamp && (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                    • Published {new Date(linkedPostInfo.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#60a5fa', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '600', flexShrink: 0 }}>
                            <span>Open Post on Platform</span>
                            <span style={{ fontSize: '0.95rem' }}>↗</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 4.5: Post-Specific Flows */}
        {activeTab === 'post_flows' && (
          <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div className="header-title">
                <h1>Post-Specific Automation Flows</h1>
                <p>Manage visual automation flows linked to individual Instagram posts or Facebook pages.</p>
              </div>
              <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => { setGuideTab('post_flow'); setIsGuideOpen(true); }}
                >
                  <Info size={16} /> User Guide
                </button>
              </div>
            </div>

            <div className="flow-list">
              {(() => {
                const postFlowsList = flows.filter(f => (f.instagram_post_id || f.facebook_post_id) && !f.is_future_flow);
                if (postFlowsList.length === 0) {
                  return (
                    <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                      <p>No post-specific automation flows created yet. You can set one up directly from the Media & Feed tab, or inside the Flow Editor.</p>
                      <button className="btn btn-primary" onClick={() => setActiveTab('posts')} style={{ marginTop: '16px' }}>
                        Go to Media & Feed
                      </button>
                    </div>
                  );
                }

                return postFlowsList.map(flow => {
                  const linkedPostInfo = getFlowLinkedPost(flow);
                  const platformName = flow.facebook_account_id ? "Facebook" : "Instagram";

                  return (
                    <div
                      key={flow.id}
                      className="card flow-item"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        padding: '20px',
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Flow Header */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                        borderBottom: '1px solid var(--border-color)',
                        paddingBottom: '14px',
                        width: '100%',
                        minWidth: 0
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: '1 1 300px', minWidth: 0 }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                            {flow.name}
                          </h3>
                          <span className={`badge ${flow.facebook_account_id ? 'badge-primary' : 'badge-success'}`} style={{ fontSize: '0.72rem', padding: '3px 10px', whiteSpace: 'nowrap' }}>
                            {platformName} ({linkedPostInfo?.accountName || 'Connected Channel'})
                          </span>
                          <span className={`badge ${flow.is_active ? 'badge-success' : 'badge-secondary'}`} style={{ fontSize: '0.72rem', padding: '3px 10px', whiteSpace: 'nowrap' }}>
                            {flow.is_active ? '● Active' : '○ Paused'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                          <button
                            className={`btn btn-accent ${runningFlowId === flow.id ? 'btn-disabled' : ''}`}
                            onClick={() => handleRunSingleFlow(flow.id)}
                            disabled={runningFlowId !== null}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '7px 14px' }}
                          >
                            <Play size={14} />
                            {runningFlowId === flow.id ? "Running..." : "Run Flow"}
                          </button>
                          <button className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '7px 14px' }} onClick={() => handleOpenBuilder(flow)}>
                            Edit Visual Flow
                          </button>
                          <button className="btn btn-danger" style={{ padding: '7px 11px' }} onClick={() => handleDeleteFlow(flow.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Display Selected Post Card (Clickable to open post on platform) */}
                      {linkedPostInfo && (
                        <div
                          onClick={() => handleOpenPostOnPlatform(linkedPostInfo)}
                          style={{
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                            borderRadius: '12px',
                            padding: '14px 18px',
                            width: '100%',
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                            minWidth: 0,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = '#818cf8'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'; e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)'; }}
                        >
                          {linkedPostInfo?.mediaUrl ? (
                            <img
                              src={linkedPostInfo.mediaUrl}
                              alt="Post thumbnail"
                              style={{
                                width: '54px',
                                height: '54px',
                                objectFit: 'cover',
                                borderRadius: '10px',
                                border: '1px solid var(--border-color)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                flexShrink: 0
                              }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div style={{
                              width: '54px',
                              height: '54px',
                              borderRadius: '10px',
                              backgroundColor: '#1a1b26',
                              border: '1px solid var(--border-color)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#9ca3af',
                              fontSize: '0.7rem',
                              flexShrink: 0
                            }}>
                              <span style={{ fontSize: '1.2rem', marginBottom: '2px' }}>📷</span>
                              <span>No Media</span>
                            </div>
                          )}

                          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                📌 CONFIGURED POST
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                ID: {linkedPostInfo?.postId}
                              </span>
                              {linkedPostInfo?.timestamp && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  • Published {new Date(linkedPostInfo.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              )}
                            </div>

                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span>Triggers on keywords:</span>
                              {flow.nodes
                                .filter(n => n.type === 'trigger')
                                .flatMap(n => n.config?.keywords || [])
                                .map(kw => (
                                  <span key={kw} className="keyword-tag">{kw}</span>
                                ))}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa', fontSize: '0.82rem', fontWeight: '600', flexShrink: 0 }}>
                            <span>Open Post on Platform</span>
                            <span style={{ fontSize: '1rem' }}>↗</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* Tab 4.6: Future Post Automation Flows */}
        {activeTab === 'future_flows' && (
          <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div className="header-title">
                <h1>⏳ Future Post Automation</h1>
                <p>Pre-configure comment & DM automation workflows for scheduled or upcoming social media posts before they are published.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => { setGuideTab('future_flow'); setIsGuideOpen(true); }}
                >
                  <Info size={16} /> User Guide
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCreateFutureFlow}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #d97706, #b45309)', border: 'none' }}
                >
                  <Plus size={16} /> Create Future Post Flow
                </button>
              </div>
            </div>

            <div className="flow-list">
              {(() => {
                const futureFlowsList = flows.filter(f => f.is_future_flow);
                if (futureFlowsList.length === 0) {
                  return (
                    <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⏳</div>
                      <h3 style={{ color: 'white', margin: '0 0 8px 0' }}>No Future Post Flows Configured</h3>
                      <p style={{ maxWidth: '520px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
                        Set up automation in advance for upcoming Reels or scheduled posts. The system continuously scans and activates the flow once the post is published.
                      </p>
                      <button className="btn btn-primary" onClick={handleCreateFutureFlow} style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', border: 'none' }}>
                        + Create First Future Post Flow
                      </button>
                    </div>
                  );
                }

                return futureFlowsList.map(flow => {
                  const linkedPostInfo = getFlowLinkedPost(flow);
                  const platformName = flow.facebook_account_id ? "Facebook" : "Instagram";
                  const matchedInsta = accounts.find(a => a.id === flow.instagram_account_id);
                  const matchedFb = facebookAccounts.find(a => a.id === flow.facebook_account_id);
                  const accountName = matchedFb ? matchedFb.name : matchedInsta ? `@${matchedInsta.username}` : "Connected Channel";

                  return (
                    <div
                      key={flow.id}
                      className="card flow-item"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        padding: '20px',
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Flow Header */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                        borderBottom: '1px solid var(--border-color)',
                        paddingBottom: '14px',
                        width: '100%',
                        minWidth: 0
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: '1 1 300px', minWidth: 0 }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                            {flow.name}
                          </h3>
                          <span className={`badge ${flow.facebook_account_id ? 'badge-primary' : 'badge-success'}`} style={{ fontSize: '0.72rem', padding: '3px 10px', whiteSpace: 'nowrap' }}>
                            {platformName} ({accountName})
                          </span>
                          <span className="badge" style={{
                            fontSize: '0.72rem',
                            padding: '3px 10px',
                            whiteSpace: 'nowrap',
                            background: flow.future_flow_status === 'resolved'
                              ? 'linear-gradient(135deg, #059669, #047857)'
                              : 'linear-gradient(135deg, #d97706, #b45309)',
                            color: 'white',
                            fontWeight: '700'
                          }}>
                            {flow.future_flow_status === 'resolved' ? '✅ Future Flow (Resolved)' : '⏳ Future Flow (Awaiting Post)'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                          {flow.future_flow_status !== 'resolved' && (
                            <button
                              className={`btn ${scanningFlowId === flow.id ? 'btn-disabled' : 'btn-secondary'}`}
                              onClick={() => handleScanFutureFlow(flow.id)}
                              disabled={scanningFlowId !== null}
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', border: '1px solid #d97706', color: '#d97706' }}
                            >
                              {scanningFlowId === flow.id ? '🔄 Scanning...' : '🔍 Scan Now'}
                            </button>
                          )}
                          <button
                            className={`btn btn-accent ${runningFlowId === flow.id ? 'btn-disabled' : ''}`}
                            onClick={() => handleRunSingleFlow(flow.id)}
                            disabled={runningFlowId !== null}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '7px 14px' }}
                          >
                            <Play size={14} />
                            {runningFlowId === flow.id ? "Running..." : "Run Flow"}
                          </button>
                          <button className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '7px 14px' }} onClick={() => handleOpenBuilder(flow)}>
                            Edit Visual Flow
                          </button>
                          <button className="btn btn-danger" style={{ padding: '7px 11px' }} onClick={() => handleDeleteFlow(flow.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Status Banner */}
                      {flow.future_flow_status !== 'resolved' ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '14px 18px',
                          background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08), rgba(180, 83, 9, 0.04))',
                          border: '1px solid rgba(217, 119, 6, 0.35)',
                          borderRadius: '12px',
                          width: '100%',
                          boxSizing: 'border-box',
                        }}>
                          <div style={{ fontSize: '2rem', flexShrink: 0 }}>⏳</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              AWAITING POST PUBLICATION
                            </span>
                            <p style={{ margin: '4px 0 2px 0', fontSize: '0.85rem', color: 'white' }}>
                              {flow.future_post_caption
                                ? <>Expected Caption Hint: <em>"{flow.future_post_caption}"</em></>
                                : 'No caption hint provided. Scanning for newly published posts.'}
                            </p>
                            {flow.future_post_scheduled_at && (
                              <p style={{ margin: '0 0 2px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                📅 Scheduled Time: {new Date(flow.future_post_scheduled_at).toLocaleString()}
                              </p>
                            )}
                            {flow.future_flow_last_scanned_at ? (
                              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                🔍 Last Scanned: {new Date(flow.future_flow_last_scanned_at).toLocaleString()}
                              </p>
                            ) : (
                              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                Automatic background scanning is active (every 5 minutes).
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        linkedPostInfo && (
                          <div
                            onClick={() => handleOpenPostOnPlatform(linkedPostInfo)}
                            style={{
                              display: 'flex',
                              gap: '16px',
                              alignItems: 'center',
                              backgroundColor: 'rgba(5, 150, 105, 0.08)',
                              border: '1px solid rgba(5, 150, 105, 0.3)',
                              borderRadius: '12px',
                              padding: '14px 18px',
                              width: '100%',
                              boxSizing: 'border-box',
                              cursor: 'pointer',
                            }}
                          >
                            <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>✅</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                AUTOMATICALLY MATCHED & LINKED TO POST
                              </span>
                              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'white', fontWeight: '600' }}>
                                Post ID: {linkedPostInfo.postId}
                              </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.82rem', fontWeight: '600' }}>
                              <span>View Post</span> ↗
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* Tab 5: Comments History */}

        {activeTab === 'comments' && (
          <div>
            <div className="page-header">
              <div className="header-title">
                <h1>Comments History</h1>
                <p>Real-time feed of comment history and automated responses parsed from your channels.</p>
              </div>
            </div>

            <div className="card">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Comment ID</th>
                      <th>Commenter</th>
                      <th>Content</th>
                      <th>Timestamp</th>
                      <th>Status</th>
                      <th>Automation Action / Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map(c => {
                      const relatedLogs = logs.filter(l => l.comment_id === c.comment_id);
                      const replyLog = relatedLogs.find(l => l.action_type === 'reply_sent');
                      const dmLog = relatedLogs.find(l => l.action_type === 'dm_sent' || l.action_type === 'dm_entry_sent');
                      const tagLog = relatedLogs.find(l => l.action_type === 'tag_added');

                      return (
                        <tr key={c.comment_id}>
                          <td><code>{c.comment_id}</code></td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <strong>@{c.username}</strong>
                              <span className={`badge ${c.platform === 'facebook' ? 'badge-primary' : 'badge-success'}`} style={{ alignSelf: 'flex-start', fontSize: '0.65rem', padding: '1px 6px', marginTop: '4px' }}>
                                {c.platform === 'facebook' ? 'Facebook' : 'Instagram'}
                              </span>
                            </div>
                          </td>
                          <td>"{c.text}"</td>
                          <td>{new Date(c.timestamp).toLocaleString()}</td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span className={`badge ${c.status === 'processed' ? 'badge-success' : c.status === 'ignored' ? 'badge-warning' : 'badge-error'}`} style={{ alignSelf: 'flex-start' }}>
                                {c.status}
                              </span>
                              {c.error_message && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '2px' }}>
                                  {c.error_message}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            {renderActionResponseCell(replyLog, dmLog, tagLog)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Execution Logs */}
        {activeTab === 'logs' && (() => {
          const allAvailablePosts = [
            ...posts.map(p => ({ ...p, platform: 'instagram', platformName: 'Instagram' })),
            ...facebookPosts.map(p => ({ ...p, platform: 'facebook', platformName: 'Facebook' }))
          ].sort((a, b) => (b.timestamp ? new Date(b.timestamp).getTime() : 0) - (a.timestamp ? new Date(a.timestamp).getTime() : 0));

          const getLogPostInfo = (log) => {
            const comment = comments.find(c => c.comment_id === log.comment_id);
            let postId = comment?.media_id || log.details?.media_id || log.details?.post_id;

            if (!postId && log.flow_id) {
              const flow = flows.find(f => f.id === log.flow_id);
              if (flow) {
                postId = flow.instagram_post_id || flow.facebook_post_id;
              }
            }

            if (!postId) return null;

            const igPost = posts.find(p => p.id === postId);
            if (igPost) {
              return {
                postId: igPost.id,
                caption: igPost.caption,
                mediaUrl: igPost.media_url || igPost.thumbnail_url,
                permalink: igPost.permalink,
                platform: 'instagram',
                platformName: 'Instagram',
                account: accounts.find(a => a.id === igPost.instagram_account_id)
              };
            }
            const fbPost = facebookPosts.find(p => p.id === postId);
            if (fbPost) {
              return {
                postId: fbPost.id,
                caption: fbPost.caption,
                mediaUrl: fbPost.media_url,
                permalink: fbPost.permalink,
                platform: 'facebook',
                platformName: 'Facebook',
                account: facebookAccounts.find(a => a.id === fbPost.facebook_account_id)
              };
            }

            return {
              postId: postId,
              caption: null,
              mediaUrl: null,
              permalink: null,
              platform: log.comment_id?.startsWith('fb_') ? 'facebook' : 'instagram',
              platformName: log.comment_id?.startsWith('fb_') ? 'Facebook' : 'Instagram',
              account: null
            };
          };

          const activeLogPostIds = new Set();
          logs.forEach(log => {
            const info = getLogPostInfo(log);
            if (info && info.postId) {
              activeLogPostIds.add(info.postId);
            }
          });
          flows.forEach(flow => {
            if (flow.instagram_post_id) activeLogPostIds.add(flow.instagram_post_id);
            if (flow.facebook_post_id) activeLogPostIds.add(flow.facebook_post_id);
          });

          const postsWithActivity = allAvailablePosts.filter(p => activeLogPostIds.has(p.id));

          const filteredLogs = logs.filter(log => {
            if (selectedLogPostId === 'all') return true;
            const logPost = getLogPostInfo(log);
            return logPost && logPost.postId === selectedLogPostId;
          });

          const selectedPostObj = allAvailablePosts.find(p => p.id === selectedLogPostId);

          const basePostsList = (logPostFilterTab === 'activity' && postsWithActivity.length > 0)
            ? postsWithActivity
            : allAvailablePosts;

          const searchedPosts = basePostsList.filter(p => {
            if (!logPostSearchTerm) return true;
            const query = logPostSearchTerm.toLowerCase();
            return (
              (p.caption && p.caption.toLowerCase().includes(query)) ||
              (p.id && p.id.toLowerCase().includes(query)) ||
              (p.platform && p.platform.toLowerCase().includes(query))
            );
          });

          return (
            <div>
              <div className="page-header" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div className="header-title" style={{ flex: 1, minWidth: '280px' }}>
                  <h1>Automation Activity</h1>
                  <p>Auditable trail of keyword triggers, public replies, DMs and tags per post.</p>
                </div>
                <div className="header-actions" style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '0.5px' }}>
                      📌 FILTER ACTIVITY BY POST / REEL:
                    </label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Custom Dropdown Trigger Button */}
                      <button
                        type="button"
                        onClick={() => setIsLogPostPickerOpen(!isLogPostPickerOpen)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          backgroundColor: 'rgba(30, 41, 59, 0.9)',
                          border: isLogPostPickerOpen ? '1px solid #6366f1' : '1px solid rgba(99, 102, 241, 0.35)',
                          borderRadius: '10px',
                          padding: '8px 14px',
                          color: 'white',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          width: '340px',
                          maxWidth: '100%',
                          justifyContent: 'space-between',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                          {selectedLogPostId === 'all' ? (
                            <>
                              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>🌐</span>
                              <span style={{ fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                All Posts & Reels ({logs.length} logs)
                              </span>
                            </>
                          ) : (
                            <>
                              {selectedPostObj?.media_url || selectedPostObj?.thumbnail_url ? (
                                <img
                                  src={selectedPostObj.media_url || selectedPostObj.thumbnail_url}
                                  alt="Thumb"
                                  style={{ width: '26px', height: '26px', objectFit: 'cover', borderRadius: '5px', flexShrink: 0 }}
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                <span className={`badge ${selectedPostObj?.platform === 'facebook' ? 'badge-primary' : 'badge-success'}`} style={{ fontSize: '0.65rem', padding: '2px 6px', flexShrink: 0 }}>
                                  {selectedPostObj?.platform === 'facebook' ? 'Facebook' : 'Instagram'}
                                </span>
                              )}
                              <span style={{ fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.82rem' }}>
                                {selectedPostObj?.caption ? (selectedPostObj.caption.slice(0, 32) + "...") : `Post ID: ${selectedLogPostId}`}
                              </span>
                            </>
                          )}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af', flexShrink: 0, marginLeft: '6px' }}>
                          {isLogPostPickerOpen ? '▲' : '▼'}
                        </span>
                      </button>

                      {selectedLogPostId !== 'all' && (
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: '0.78rem', padding: '8px 12px', whiteSpace: 'nowrap', backgroundColor: 'rgba(255,255,255,0.06)' }}
                          onClick={() => {
                            setSelectedLogPostId('all');
                            setIsLogPostPickerOpen(false);
                          }}
                          title="Reset to view logs for all posts"
                        >
                          Clear Filter
                        </button>
                      )}
                    </div>

                    {/* Custom Dropdown Popup */}
                    {isLogPostPickerOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 6px)',
                          right: 0,
                          width: '400px',
                          maxWidth: '90vw',
                          backgroundColor: '#0f172a',
                          border: '1px solid rgba(99, 102, 241, 0.4)',
                          borderRadius: '14px',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
                          zIndex: 1000,
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        {/* Search Header inside popup */}
                        <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1e293b' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="🔍 Search post by caption or ID..."
                            value={logPostSearchTerm}
                            onChange={(e) => setLogPostSearchTerm(e.target.value)}
                            style={{
                              backgroundColor: '#090d16',
                              color: 'white',
                              border: '1px solid rgba(255,255,255,0.15)',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontSize: '0.82rem',
                              width: '100%'
                            }}
                            autoFocus
                          />
                          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                            <button
                              type="button"
                              onClick={() => setLogPostFilterTab('activity')}
                              style={{
                                flex: 1,
                                padding: '5px 8px',
                                fontSize: '0.72rem',
                                fontWeight: '600',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: logPostFilterTab === 'activity' ? '#6366f1' : 'rgba(255,255,255,0.06)',
                                color: 'white',
                                transition: 'all 0.15s'
                              }}
                            >
                              ⚡ With Activity / Logs ({postsWithActivity.length})
                            </button>
                            <button
                              type="button"
                              onClick={() => setLogPostFilterTab('all')}
                              style={{
                                flex: 1,
                                padding: '5px 8px',
                                fontSize: '0.72rem',
                                fontWeight: '600',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: logPostFilterTab === 'all' ? '#6366f1' : 'rgba(255,255,255,0.06)',
                                color: 'white',
                                transition: 'all 0.15s'
                              }}
                            >
                              🌐 All Posts ({allAvailablePosts.length})
                            </button>
                          </div>
                        </div>

                        {/* Scrollable list of posts */}
                        <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '6px' }}>
                          {/* Option: All Posts */}
                          <div
                            onClick={() => {
                              setSelectedLogPostId('all');
                              setIsLogPostPickerOpen(false);
                            }}
                            style={{
                              padding: '10px 12px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              backgroundColor: selectedLogPostId === 'all' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                              border: selectedLogPostId === 'all' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                              marginBottom: '4px',
                              transition: 'background-color 0.15s'
                            }}
                            onMouseEnter={(e) => { if (selectedLogPostId !== 'all') e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}
                            onMouseLeave={(e) => { if (selectedLogPostId !== 'all') e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <span style={{ fontSize: '1.2rem' }}>🌐</span>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>All Posts & Reels</span>
                              <span style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>View logs for all published content ({logs.length} logs)</span>
                            </div>
                          </div>

                          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', margin: '6px 0' }} />

                          {/* List of matching posts */}
                          {searchedPosts.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              No matching posts found.
                            </div>
                          ) : (
                            searchedPosts.map(p => {
                              const isSelected = selectedLogPostId === p.id;
                              const mediaUrl = p.media_url || p.thumbnail_url;
                              return (
                                <div
                                  key={p.id}
                                  onClick={() => {
                                    setSelectedLogPostId(p.id);
                                    setIsLogPostPickerOpen(false);
                                  }}
                                  style={{
                                    padding: '8px 10px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                                    border: isSelected ? '1px solid #6366f1' : '1px solid transparent',
                                    marginBottom: '4px',
                                    transition: 'background-color 0.15s'
                                  }}
                                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}
                                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                  {mediaUrl ? (
                                    <img
                                      src={mediaUrl}
                                      alt="Thumbnail"
                                      style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  ) : (
                                    <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
                                      📷
                                    </div>
                                  )}

                                  <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                      <span className={`badge ${p.platform === 'facebook' ? 'badge-primary' : 'badge-success'}`} style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                                        {p.platformName}
                                      </span>
                                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                        ID: {p.id}
                                      </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'white', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {p.caption || "No Caption"}
                                    </p>
                                  </div>

                                  {isSelected && (
                                    <span style={{ color: '#818cf8', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 }}>✓</span>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Comment ID</th>
                        <th>Target Post</th>
                        <th>Action</th>
                        <th>Status</th>
                        <th>Response / Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                            No automation activity found for the selected filter.
                          </td>
                        </tr>
                      ) : (
                        filteredLogs.map(log => {
                          const logPost = getLogPostInfo(log);
                          return (
                            <tr key={log.id}>
                              <td>{new Date(log.created_at || Date.now()).toLocaleString()}</td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <code>{log.comment_id}</code>
                                  {(() => {
                                    const matchedFlow = flows.find(f => f.id === log.flow_id);
                                    const isFb = matchedFlow ? !!matchedFlow.facebook_account_id : log.comment_id?.startsWith('fb_');
                                    return (
                                      <span className={`badge ${isFb ? 'badge-primary' : 'badge-success'}`} style={{ alignSelf: 'flex-start', fontSize: '0.65rem', padding: '1px 6px', marginTop: '4px' }}>
                                        {isFb ? 'Facebook' : 'Instagram'}
                                      </span>
                                    );
                                  })()}
                                </div>
                              </td>
                              <td>
                                {!logPost ? (
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Account-wide / General</span>
                                ) : (
                                  <div
                                    onClick={() => logPost.permalink && handleOpenPostOnPlatform(logPost)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      padding: '6px 10px',
                                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                      border: '1px solid rgba(255, 255, 255, 0.08)',
                                      borderRadius: '8px',
                                      maxWidth: '280px',
                                      cursor: logPost.permalink ? 'pointer' : 'default',
                                      transition: 'all 0.15s ease'
                                    }}
                                    title={logPost.caption || `Post ID: ${logPost.postId}`}
                                  >
                                    {logPost.mediaUrl ? (
                                      <img
                                        src={logPost.mediaUrl}
                                        alt="Thumbnail"
                                        style={{ width: '34px', height: '34px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                      />
                                    ) : (
                                      <div style={{ width: '34px', height: '34px', borderRadius: '6px', backgroundColor: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#9ca3af', flexShrink: 0 }}>
                                        📷
                                      </div>
                                    )}
                                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span className={`badge ${logPost.platform === 'facebook' ? 'badge-primary' : 'badge-success'}`} style={{ fontSize: '0.6rem', padding: '1px 5px' }}>
                                          {logPost.platformName}
                                        </span>
                                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                          ID: {logPost.postId.slice(-6)}
                                        </span>
                                      </div>
                                      <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'white', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {logPost.caption || `Post ID: ${logPost.postId}`}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td>
                                {renderActionTypeBadge(log.action_type)}
                              </td>
                              <td>
                                <span className={`badge ${log.status === 'success' ? 'badge-success' : 'badge-error'}`} style={{ textTransform: 'capitalize' }}>
                                  {log.status === 'success' ? 'Success' : log.status || 'Failed'}
                                </span>
                              </td>
                              <td>
                                {renderExecutionLogDetails(log)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {activeTab === 'dms' && (
          <div>
            <div className="page-header">
              <div className="header-title">
                <h1>Personal DM Automation</h1>
                <p>Automate replies to direct messages sent by users to your connected Instagram Business accounts.</p>
              </div>
              <div className="header-actions">
                <button className="btn btn-primary" onClick={handleOpenNewDmRule}>
                  <Plus size={16} /> Create DM Automation
                </button>
              </div>
            </div>

            {/* Sub-tab selection header */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <button
                className={`btn ${dmSubTab === 'rules' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                onClick={() => setDmSubTab('rules')}
              >
                Rules & Triggers
              </button>
              <button
                className={`btn ${dmSubTab === 'executions' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                onClick={() => setDmSubTab('executions')}
              >
                Rule Executions ({dmExecutions.length})
              </button>
            </div>

            {/* Rules list sub-tab */}
            {dmSubTab === 'rules' && (
              <div className="flow-list">
                {dmRules.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
                    <p>No Personal DM automation rules created yet. Get started by creating your first rule.</p>
                  </div>
                ) : (
                  dmRules.map(rule => {
                    const matchedInsta = accounts.find(a => a.id === rule.instagram_account_id);
                    const accountName = matchedInsta ? `@${matchedInsta.username}` : "Unlinked";

                    let replyDisplay = rule.reply_text;
                    let isJsonTemplate = false;
                    let templateType = '';
                    let hasImage = false;
                    try {
                      const stripped = rule.reply_text.trim();
                      if (stripped.startsWith('{') && stripped.endsWith('}')) {
                        const jsonReply = JSON.parse(stripped);
                        replyDisplay = jsonReply.message_text || jsonReply.text || jsonReply.reply_text || '';
                        isJsonTemplate = true;
                        templateType = jsonReply.dm_type || 'link_dm';
                        hasImage = Boolean(jsonReply.image_url);
                      }
                    } catch (e) {
                      // Plain text
                    }

                    return (
                      <div key={rule.id} className="card flow-item">
                        <div className="flow-meta">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <h3 style={{ margin: 0 }}>{rule.name}</h3>
                            <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                              Instagram ({accountName})
                            </span>
                            <span className={`badge ${rule.is_active ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                              {rule.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p style={{ margin: '8px 0', fontSize: '0.9rem' }}>
                            <strong>Template / Trigger:</strong> <span style={{ textTransform: 'capitalize', color: 'var(--primary-color)' }}>
                              {rule.trigger_type === 'any_message' ? 'Post Flow & DM Template' : rule.trigger_type.replace('_', ' ')}
                            </span>
                            {rule.keyword && (
                              <>
                                {' | '}<strong>Keyword:</strong> <span className="keyword-tag">{rule.keyword}</span>
                              </>
                            )}
                          </p>
                          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '600px' }}>
                            <strong>Reply with:</strong> {isJsonTemplate ? (
                              <>
                                <span className="badge" style={{
                                  fontSize: '0.65rem',
                                  padding: '2px 6px',
                                  marginRight: '6px',
                                  textTransform: 'capitalize',
                                  backgroundColor: templateType === 'link_dm' ? '#8b5cf6' : 'var(--primary)',
                                  color: 'white',
                                  display: 'inline-block',
                                  borderRadius: '4px',
                                  verticalAlign: 'middle'
                                }}>
                                  {templateType === 'link_dm' ? '🔗 Link DM (Meta Compliant)' : `📋 ${templateType.replace('_', ' ')}`}
                                </span>
                                {hasImage && (
                                  <span className="badge" style={{ fontSize: '0.65rem', padding: '2px 6px', marginRight: '6px', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.4)', display: 'inline-block', borderRadius: '4px', verticalAlign: 'middle' }}>
                                    🖼️ With Image
                                  </span>
                                )}
                              </>
                            ) : null} <span style={{ verticalAlign: 'middle' }}>"{replyDisplay}"</span>
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <button
                            className={`btn ${rule.is_active ? 'btn-secondary' : 'btn-accent'}`}
                            onClick={() => handleToggleDmRuleActive(rule)}
                            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                          >
                            {rule.is_active ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setPreviewDmRule(rule)}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px' }}
                            title="Preview DM conversation sequence"
                          >
                            👁️ Preview
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleOpenEditDmRule(rule)}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px' }}
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '8px 10px' }}
                            onClick={() => handleDeleteDmRule(rule.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Message log sub-tab */}
            {dmSubTab === 'messages' && (
              <div className="card">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Message ID</th>
                        <th>Account</th>
                        <th>Sender</th>
                        <th>Content</th>
                        <th>Timestamp</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dmMessages.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No messages logged yet.</td>
                        </tr>
                      ) : (
                        dmMessages.map(msg => {
                          const matchedInsta = accounts.find(a => a.id === msg.instagram_account_id);
                          const accountName = matchedInsta ? `@${matchedInsta.username}` : "Unlinked";
                          return (
                            <tr key={msg.id}>
                              <td><code>{msg.id.substring(0, 12)}...</code></td>
                              <td><span className="badge badge-success">{accountName}</span></td>
                              <td><strong>@{msg.sender_id}</strong></td>
                              <td>"{msg.text}"</td>
                              <td>{new Date(msg.timestamp).toLocaleString()}</td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span className={`badge ${msg.status === 'processed' ? 'badge-success' : msg.status === 'ignored' ? 'badge-warning' : 'badge-error'}`} style={{ alignSelf: 'flex-start' }}>
                                    {msg.status}
                                  </span>
                                  {msg.error_message && (
                                    <span style={{ fontSize: '0.72rem', color: 'var(--error)', marginTop: '2px' }}>
                                      {msg.error_message}
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Conversation sub-tab */}
            {dmSubTab === 'conversations' && (
              <div className="card">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Conversation ID</th>
                        <th>Account</th>
                        <th>Participant</th>
                        <th>Last Active</th>
                        <th>Started At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dmConversations.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No active conversations discovered yet.</td>
                        </tr>
                      ) : (
                        dmConversations.map(conv => {
                          const matchedInsta = accounts.find(a => a.id === conv.instagram_account_id);
                          const accountName = matchedInsta ? `@${matchedInsta.username}` : "Unlinked";
                          return (
                            <tr key={conv.id}>
                              <td><code>{conv.id}</code></td>
                              <td><span className="badge badge-success">{accountName}</span></td>
                              <td><strong>@{conv.participant_id}</strong></td>
                              <td>{new Date(conv.last_message_at).toLocaleString()}</td>
                              <td>{new Date(conv.created_at).toLocaleString()}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Executions sub-tab */}
            {dmSubTab === 'executions' && (
              <div className="card">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Execution ID</th>
                        <th>Matched Automation Rule</th>
                        <th>Trigger Message ID</th>
                        <th>Status</th>
                        <th>Executed At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dmExecutions.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No rule executions recorded yet.</td>
                        </tr>
                      ) : (
                        dmExecutions.map(ex => {
                          const matchedRule = dmRules.find(r => r.id === ex.automation_id);
                          const ruleName = matchedRule ? matchedRule.name : `Rule (${ex.automation_id})`;
                          return (
                            <tr key={ex.id}>
                              <td><code>{ex.id}</code></td>
                              <td><strong>{ruleName}</strong></td>
                              <td><code>{ex.message_id.substring(0, 12)}...</code></td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span className={`badge ${ex.status === 'success' ? 'badge-success' : 'badge-error'}`} style={{ alignSelf: 'flex-start' }}>
                                    {ex.status}
                                  </span>
                                  {ex.error_message && (
                                    <span style={{ fontSize: '0.72rem', color: 'var(--error)', marginTop: '2px' }}>
                                      {ex.error_message}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td>{new Date(ex.executed_at).toLocaleString()}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DM Rule Edit Modal Overlay */}
            {showDmModal && (
              <div className="modal-overlay" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2000,
                padding: '20px'
              }}>
                <div className="card" style={{
                  width: '100%',
                  maxWidth: '950px',
                  maxHeight: '95vh',
                  overflowY: 'auto',
                  backgroundColor: '#111827',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  position: 'relative',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {/* Close button */}
                  <button
                    onClick={() => { setShowDmModal(false); setEditingDmRule(null); }}
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      zIndex: 10
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'white'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                  >
                    &times;
                  </button>

                  {/* Header Title */}
                  <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--primary)' }}>⚡</span> {editingDmRule ? "Edit Draft & Automation" : "Create Draft"}
                    </h2>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      Build your automated reply flow template and match it with triggers.
                    </p>
                  </div>

                  {/* Two-Column Body Content */}
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>

                    {/* Left Column: Form Settings (Tabs) */}
                    <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                      {/* Tabs Navigation Header */}
                      <div style={{
                        display: 'flex',
                        borderBottom: '1px solid var(--border-color)',
                        gap: '4px',
                        paddingBottom: '2px'
                      }}>
                        <button
                          type="button"
                          onClick={() => setModalTab('dm_setup')}
                          style={{
                            padding: '8px 16px',
                            background: 'none',
                            border: 'none',
                            color: modalTab === 'dm_setup' ? 'var(--primary)' : 'var(--text-secondary)',
                            borderBottom: modalTab === 'dm_setup' ? '2px solid var(--primary)' : '2px solid transparent',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          ✉️ DM Setup
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalTab('trigger_setup')}
                          style={{
                            padding: '8px 16px',
                            background: 'none',
                            border: 'none',
                            color: modalTab === 'trigger_setup' ? 'var(--primary)' : 'var(--text-secondary)',
                            borderBottom: modalTab === 'trigger_setup' ? '2px solid var(--primary)' : '2px solid transparent',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          ⚙️ Trigger Setup
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalTab('settings')}
                          style={{
                            padding: '8px 16px',
                            background: 'none',
                            border: 'none',
                            color: modalTab === 'settings' ? 'var(--primary)' : 'var(--text-secondary)',
                            borderBottom: modalTab === 'settings' ? '2px solid var(--primary)' : '2px solid transparent',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          ⚙️ Settings
                        </button>
                      </div>

                      {/* Tab Body Contents */}
                      <div style={{ minHeight: '340px' }}>

                        {/* TAB 1: DM SETUP */}
                        {modalTab === 'dm_setup' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Draft Name *</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={dmRuleForm.name}
                                  onChange={(e) => setDmRuleForm(prev => ({ ...prev, name: e.target.value }))}
                                  required
                                />
                              </div>
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instagram Account *</label>
                                <select
                                  className="form-control"
                                  value={dmRuleForm.instagram_account_id}
                                  onChange={(e) => setDmRuleForm(prev => ({ ...prev, instagram_account_id: e.target.value }))}
                                >
                                  {accounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>@{acc.username}</option>
                                  ))}
                                </select>
                              </div>
                              <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>DM Type</label>
                                <select
                                  className="form-control"
                                  value={dmRuleForm.dm_type}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setDmRuleForm(prev => ({
                                      ...prev,
                                      dm_type: val,
                                      require_follow: val === 'follow_gate'
                                    }));
                                  }}
                                >
                                  <option value="follow_gate">🔒 Follow-to-Unlock DM (Comment → Follow → Link)</option>
                                  <option value="link_dm">✨ Link DM (Comment → Link)</option>
                                  <option value="button_template">Button Template</option>
                                  <option value="message_template">Message Template (Plain Text)</option>
                                </select>
                              </div>
                            </div>

                            {/* Meta Policy Compliance Notice */}
                            <div style={{
                              fontSize: '0.74rem',
                              color: '#60a5fa',
                              backgroundColor: 'rgba(59, 130, 246, 0.08)',
                              border: '1px solid rgba(59, 130, 246, 0.25)',
                              borderRadius: '8px',
                              padding: '10px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span style={{ fontSize: '1.1rem' }}>🛡️</span>
                              <div>
                                {(dmRuleForm.dm_type === 'follow_gate' || dmRuleForm.require_follow) ? (
                                  <>
                                    <strong>Meta Platform Compliant Follow-to-Unlock Flow:</strong> Commenting on a post sends an immediate Private Reply. User taps <em>"{dmRuleForm.entry_button_text || '➡️ Send me the Link!'}"</em> to open the 24-Hour window, gets the Follow Gate card, and receives the destination link once following.
                                  </>
                                ) : (
                                  <>
                                    <strong>Meta Platform Compliant 2-Step Flow:</strong> Commenting on a post sends an immediate Private Reply. When the user taps your action button, Meta officially opens the <strong>24-Hour Messaging Window</strong> to deliver your direct link.
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Link DM & Follow Gate Configuration */}
                            {(dmRuleForm.dm_type === 'link_dm' || dmRuleForm.dm_type === 'button_template' || dmRuleForm.dm_type === 'follow_gate' || dmRuleForm.require_follow) && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {/* Section 1: Comment -> DM Entry (Private Reply) */}
                                <div style={{
                                  border: '1px solid var(--border-color)',
                                  borderRadius: '10px',
                                  padding: '14px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '10px'
                                }}>
                                  <div style={{ fontSize: '0.82rem', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>1️⃣ Step 1: Comment → Private Reply (DM Entry)</span>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                      Private Reply Message (Sent immediately when user comments) *
                                    </label>
                                    <textarea
                                      className="form-control"
                                      rows="3"
                                      placeholder="👋 Thanks for the comment.&#10;&#10;Tap the button below and I'll send you the link right away!&#10;Reply STOP to opt-out"
                                      required
                                      value={dmRuleForm.entry_message}
                                      onChange={(e) => setDmRuleForm(prev => ({ ...prev, entry_message: e.target.value }))}
                                      style={{ resize: 'vertical' }}
                                    />
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                      Entry Action Button Text *
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="➡️ Send me the Link!"
                                      required
                                      value={dmRuleForm.entry_button_text}
                                      onChange={(e) => setDmRuleForm(prev => ({ ...prev, entry_button_text: e.target.value }))}
                                    />
                                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                      💡 Tapping this button in Instagram DMs officially unlocks the Meta 24-hour messaging window.
                                    </span>
                                  </div>
                                </div>

                                {/* Section 2 (Follow Gate Step): Rendered when follow is required */}
                                {(dmRuleForm.dm_type === 'follow_gate' || dmRuleForm.require_follow) && (
                                  <div style={{
                                    border: '1px solid rgba(168, 85, 247, 0.4)',
                                    borderRadius: '10px',
                                    padding: '14px',
                                    backgroundColor: 'rgba(168, 85, 247, 0.04)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                  }}>
                                    <div style={{ fontSize: '0.82rem', color: '#c084fc', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span>2️⃣ Step 2: Follow-to-Unlock Gate (Instagram Verified)</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Account to Follow *</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                          <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>@</span>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="rish.jain89"
                                            value={dmRuleForm.follow_username || ''}
                                            onChange={(e) => {
                                              const uname = e.target.value.replace('@', '');
                                              setDmRuleForm(prev => ({
                                                ...prev,
                                                follow_username: uname,
                                                follow_intro_text: `Follow me here ➡️ @${uname}`,
                                                follow_url: `https://instagram.com/${uname}`
                                              }));
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Follow Intro Message</label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Follow me here ➡️ @rish.jain89"
                                          value={dmRuleForm.follow_intro_text || ''}
                                          onChange={(e) => setDmRuleForm(prev => ({ ...prev, follow_intro_text: e.target.value }))}
                                        />
                                      </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Gate Card Title</label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="➡️ You need to be following me to unlock this DM"
                                          value={dmRuleForm.title || ''}
                                          onChange={(e) => setDmRuleForm(prev => ({ ...prev, title: e.target.value }))}
                                        />
                                      </div>
                                      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Gate Card Subtitle</label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Once you’re following, click the button below to get the DM!"
                                          value={dmRuleForm.subtitle || ''}
                                          onChange={(e) => setDmRuleForm(prev => ({ ...prev, subtitle: e.target.value }))}
                                        />
                                      </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Follow Button Label</label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Follow me here"
                                          value={dmRuleForm.follow_button_text || ''}
                                          onChange={(e) => setDmRuleForm(prev => ({ ...prev, follow_button_text: e.target.value }))}
                                        />
                                      </div>
                                      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Unlock Action Button</label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="✅ Send me the DM"
                                          value={dmRuleForm.confirm_button_text || ''}
                                          onChange={(e) => setDmRuleForm(prev => ({ ...prev, confirm_button_text: e.target.value }))}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Destination Link DM Section */}
                                <div style={{
                                  border: '1px solid var(--border-color)',
                                  borderRadius: '10px',
                                  padding: '14px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '12px'
                                }}>
                                  <div style={{ fontSize: '0.82rem', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>{(dmRuleForm.dm_type === 'follow_gate' || dmRuleForm.require_follow) ? '3️⃣ Step 3: Delivered Link DM (Delivered upon following)' : '2️⃣ Step 2: Delivered Link DM (Delivered upon button tap)'}</span>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                      Link DM Message Text *
                                    </label>
                                    <textarea
                                      className="form-control"
                                      rows="2"
                                      placeholder="Here is the link you requested 👇"
                                      required
                                      value={dmRuleForm.message_text || dmRuleForm.reply_text}
                                      onChange={(e) => setDmRuleForm(prev => ({ ...prev, message_text: e.target.value, reply_text: e.target.value }))}
                                      style={{ resize: 'vertical' }}
                                    />
                                  </div>
                                  <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Button Label</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Open Link"
                                        value={dmRuleForm.button_text}
                                        onChange={(e) => setDmRuleForm(prev => ({ ...prev, button_text: e.target.value }))}
                                      />
                                    </div>
                                    <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Destination Link URL *</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="https://yourwebsite.com/guide"
                                        required
                                        value={dmRuleForm.link_url || dmRuleForm.button_url}
                                        onChange={(e) => setDmRuleForm(prev => ({ ...prev, link_url: e.target.value, button_url: e.target.value }))}
                                      />
                                    </div>
                                  </div>

                                  {/* Card Header Image Attachment (Optional) */}
                                  <div style={{
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '8px',
                                    padding: '10px 12px',
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                      <div style={{ fontSize: '0.76rem', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>Card Header Image</span>
                                        <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px' }}>Optional</span>
                                      </div>
                                      {dmRuleForm.image_url && (
                                        <button
                                          type="button"
                                          onClick={() => setDmRuleForm(prev => ({ ...prev, image_url: '' }))}
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--error)',
                                            fontSize: '0.72rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                          }}
                                        >
                                          <Trash2 size={12} /> Remove Image
                                        </button>
                                      )}
                                    </div>

                                    {dmRuleForm.image_url ? (
                                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <img
                                          src={ensureAbsoluteUrl(dmRuleForm.image_url)}
                                          alt="Card Preview"
                                          style={{ width: '54px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                                        />
                                        <div style={{ flex: 1, minWidth: 0, fontSize: '0.72rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                          {dmRuleForm.image_url}
                                        </div>
                                        <button
                                          type="button"
                                          className="btn btn-secondary"
                                          style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                                          onClick={() => dmImageFileInputRef.current?.click()}
                                          disabled={isUploadingDmImage}
                                        >
                                          Change
                                        </button>
                                      </div>
                                    ) : (
                                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <button
                                          type="button"
                                          className="btn btn-secondary"
                                          style={{ padding: '6px 12px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                                          onClick={() => dmImageFileInputRef.current?.click()}
                                          disabled={isUploadingDmImage}
                                        >
                                          <Upload size={13} />
                                          {isUploadingDmImage ? 'Uploading...' : 'Upload Image'}
                                        </button>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>or URL:</span>
                                        <input
                                          type="text"
                                          className="form-control"
                                          style={{ flex: 1, fontSize: '0.75rem', padding: '6px 10px' }}
                                          placeholder="https://example.com/banner.jpg"
                                          value={dmRuleForm.image_url}
                                          onChange={(e) => setDmRuleForm(prev => ({ ...prev, image_url: e.target.value }))}
                                        />
                                      </div>
                                    )}

                                    {/* Hidden File Input */}
                                    <input
                                      type="file"
                                      ref={dmImageFileInputRef}
                                      accept="image/png, image/jpeg, image/webp, image/gif"
                                      style={{ display: 'none' }}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          handleUploadDmImage(file);
                                          e.target.value = '';
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Message Template (Plain Text) */}
                            {dmRuleForm.dm_type === 'message_template' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Automated Message Body *</label>
                                <textarea
                                  className="form-control"
                                  rows="4"
                                  placeholder="Type the automated response message..."
                                  required
                                  value={dmRuleForm.reply_text}
                                  onChange={(e) => setDmRuleForm(prev => ({ ...prev, reply_text: e.target.value }))}
                                  style={{ resize: 'vertical' }}
                                />
                              </div>
                            )}

                          </div>
                        )}

                        {/* TAB 2: TRIGGER SETUP */}
                        {modalTab === 'trigger_setup' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Instagram Account *</label>
                              <select
                                className="form-control"
                                required
                                value={dmRuleForm.instagram_account_id}
                                onChange={(e) => setDmRuleForm(prev => ({ ...prev, instagram_account_id: e.target.value }))}
                              >
                                {accounts.length === 0 ? (
                                  <option value="">No linked Instagram accounts</option>
                                ) : (
                                  accounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>@{acc.username} ({acc.name})</option>
                                  ))
                                )}
                              </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>DM Trigger Mode *</label>
                              <select
                                className="form-control"
                                required
                                value={dmRuleForm.trigger_type}
                                onChange={(e) => setDmRuleForm(prev => ({ ...prev, trigger_type: e.target.value }))}
                              >
                                <option value="any_message">Any Message / Post Flow Template (Default)</option>
                                <option value="first_message">First Message Ever Received in DM</option>
                              </select>
                            </div>

                            <div style={{
                              fontSize: '0.78rem',
                              color: 'var(--text-secondary)',
                              backgroundColor: 'rgba(59, 130, 246, 0.08)',
                              border: '1px solid rgba(59, 130, 246, 0.25)',
                              borderRadius: '6px',
                              padding: '10px 12px',
                              lineHeight: '1.4'
                            }}>
                              <span style={{ fontWeight: 'bold', color: '#60a5fa' }}>💡 No Keyword Needed in Personal DM:</span>
                              <p style={{ margin: '4px 0 0 0' }}>
                                Keywords (such as <strong>"Guide"</strong>) are set inside your <strong>Post Automation Flows</strong> on comment triggers.
                                This Personal DM template serves as the rich card with your image & button that is automatically delivered to commenters.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* TAB 3: SETTINGS */}
                        {modalTab === 'settings' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                              <input
                                type="checkbox"
                                id="dm_is_active"
                                checked={dmRuleForm.is_active}
                                onChange={(e) => setDmRuleForm(prev => ({ ...prev, is_active: e.target.checked }))}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor="dm_is_active" style={{ fontSize: '0.88rem', color: 'white', fontWeight: 'bold', cursor: 'pointer', margin: 0 }}>
                                  Keep Rule Active
                                </label>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Enable or disable this automation flow instantly.</span>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Modal Footer Controls */}
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: 'auto' }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => { setShowDmModal(false); setEditingDmRule(null); }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveDmRule}
                          type="submit"
                          className={`btn btn-primary ${isDmsSaving ? 'btn-disabled' : ''}`}
                          disabled={isDmsSaving}
                        >
                          {isDmsSaving ? "Saving..." : (editingDmRule ? "Update Draft" : "Save Draft")}
                        </button>
                      </div>

                    </div>

                    {/* Right Column: Live Device Mockup Preview */}
                    <div style={{
                      flex: '0 0 320px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingLeft: '24px',
                      borderLeft: '1px solid var(--border-color)'
                    }}>

                      {/* Phone container */}
                      <div style={{
                        width: '280px',
                        height: '520px',
                        borderRadius: '36px',
                        border: '12px solid #1f2937',
                        backgroundColor: '#030712',
                        position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>

                        {/* Status bar / Notch */}
                        <div style={{
                          width: '110px',
                          height: '18px',
                          backgroundColor: '#1f2937',
                          borderBottomLeftRadius: '12px',
                          borderBottomRightRadius: '12px',
                          position: 'absolute',
                          top: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 10
                        }} />

                        {/* Instagram DM Header */}
                        <div style={{
                          height: '56px',
                          borderBottom: '1px solid #1f2937',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px 12px 0 12px',
                          gap: '8px',
                          backgroundColor: '#090d16'
                        }}>
                          <div style={{ fontSize: '0.8rem', color: '#9ca3af', cursor: 'pointer' }}>❮</div>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            ig
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'white' }}>
                              {accounts.find(a => a.id === dmRuleForm.instagram_account_id)?.username ? `@${accounts.find(a => a.id === dmRuleForm.instagram_account_id)?.username}` : 'instagram_page'}
                            </span>
                            <span style={{ fontSize: '0.6rem', color: '#6b7280' }}>Active now</span>
                          </div>
                        </div>

                        {/* Live Phone Interactive Preview Toolbar */}
                        {(() => {
                          const isFollowGate = Boolean(dmRuleForm.dm_type === 'follow_gate' || dmRuleForm.require_follow);
                          const isLinkOrFollow = dmRuleForm.dm_type === 'link_dm' || dmRuleForm.dm_type === 'button_template' || isFollowGate;

                          if (!isLinkOrFollow) return null;

                          return (
                            <div style={{
                              display: 'flex',
                              gap: '4px',
                              padding: '6px 8px',
                              backgroundColor: '#0a0d14',
                              borderBottom: '1px solid #1f2937',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <span style={{ fontSize: '0.62rem', color: '#9ca3af', fontWeight: 'bold' }}>Simulate:</span>
                              <div style={{ display: 'flex', gap: '3px' }}>
                                <button
                                  type="button"
                                  onClick={() => setPreviewStep(1)}
                                  style={{
                                    padding: '2px 5px',
                                    fontSize: '0.58rem',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: previewStep === 1 ? '#3b82f6' : 'rgba(255,255,255,0.06)',
                                    color: 'white',
                                    fontWeight: previewStep === 1 ? '600' : 'normal'
                                  }}
                                >
                                  1. Post
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPreviewStep(2)}
                                  style={{
                                    padding: '2px 5px',
                                    fontSize: '0.58rem',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: previewStep === 2 ? '#8b5cf6' : 'rgba(255,255,255,0.06)',
                                    color: 'white',
                                    fontWeight: previewStep === 2 ? '600' : 'normal'
                                  }}
                                >
                                  2. Entry
                                </button>
                                {isFollowGate && (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewStep(3)}
                                    style={{
                                      padding: '2px 5px',
                                      fontSize: '0.58rem',
                                      borderRadius: '4px',
                                      border: 'none',
                                      cursor: 'pointer',
                                      backgroundColor: previewStep === 3 ? '#ec4899' : 'rgba(255,255,255,0.06)',
                                      color: 'white',
                                      fontWeight: previewStep === 3 ? '600' : 'normal'
                                    }}
                                  >
                                    3. Gate
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setPreviewStep(isFollowGate ? 4 : 3)}
                                  style={{
                                    padding: '2px 5px',
                                    fontSize: '0.58rem',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: (isFollowGate ? previewStep === 4 : previewStep === 3) ? '#10b981' : 'rgba(255,255,255,0.06)',
                                    color: 'white',
                                    fontWeight: (isFollowGate ? previewStep === 4 : previewStep === 3) ? '600' : 'normal'
                                  }}
                                >
                                  {isFollowGate ? '4. Link' : '3. Link'}
                                </button>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Message Panel Area */}
                        <div style={{
                          flex: 1,
                          padding: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          overflowY: 'auto',
                          backgroundColor: '#030712'
                        }}>
                          {(() => {
                            const isFollowGate = Boolean(dmRuleForm.dm_type === 'follow_gate' || dmRuleForm.require_follow);
                            const isLinkOrFollow = dmRuleForm.dm_type === 'link_dm' || dmRuleForm.dm_type === 'button_template' || isFollowGate;

                            if (!isLinkOrFollow) {
                              return (
                                <>
                                  {dmRuleForm.keyword && (
                                    <div style={{ alignSelf: 'flex-start', backgroundColor: '#1f2937', color: 'white', borderRadius: '14px', padding: '8px 12px', fontSize: '0.72rem', maxWidth: '80%' }}>
                                      {dmRuleForm.keyword}
                                    </div>
                                  )}
                                  <div style={{ alignSelf: 'flex-end', maxWidth: '85%' }}>
                                    <div style={{ backgroundColor: '#3b82f6', color: 'white', borderRadius: '14px', padding: '8px 12px', fontSize: '0.72rem' }}>
                                      {dmRuleForm.reply_text || "Welcome!"}
                                    </div>
                                  </div>
                                </>
                              );
                            }

                            const followHandle = dmRuleForm.follow_username || 'rish.jain89';

                            return (
                              <>
                                {/* Simulated Instagram Post Comment Notice */}
                                <div style={{
                                  backgroundColor: '#18181b',
                                  border: '1px solid #27272a',
                                  borderRadius: '10px',
                                  padding: '8px 10px',
                                  fontSize: '0.68rem',
                                  color: '#a1a1aa',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '6px'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      💬 Instagram Post Comment
                                    </span>
                                    <span style={{ fontSize: '0.6rem', color: '#60a5fa' }}>Public Post</span>
                                  </div>
                                  <div style={{
                                    backgroundColor: '#27272a',
                                    padding: '5px 8px',
                                    borderRadius: '6px',
                                    color: '#e4e4e7',
                                    fontSize: '0.72rem'
                                  }}>
                                    <strong>@user:</strong> "{dmRuleForm.keyword ? dmRuleForm.keyword : "send me the link please! 🔥"}"
                                  </div>
                                  {previewStep === 1 && (
                                    <button
                                      type="button"
                                      onClick={() => setPreviewStep(2)}
                                      style={{
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '5px 8px',
                                        fontSize: '0.68rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        marginTop: '2px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px'
                                      }}
                                    >
                                      <span>⚡</span> Trigger DM Entry Reply
                                    </button>
                                  )}
                                </div>

                                {/* STEP 2+: Bot DM Entry Private Reply */}
                                {previewStep >= 2 && (
                                  <div style={{ alignSelf: 'flex-start', maxWidth: '88%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{
                                      backgroundColor: '#262626',
                                      color: 'white',
                                      borderRadius: '16px',
                                      padding: '10px 12px',
                                      fontSize: '0.72rem',
                                      lineHeight: '1.4',
                                      whiteSpace: 'pre-wrap'
                                    }}>
                                      {dmRuleForm.entry_message || "👋 Thanks for the comment.\n\nTap the button below and I'll send you the link right away!\nReply STOP to opt-out"}
                                    </div>

                                    {/* Action Button */}
                                    <div
                                      onClick={() => setPreviewStep(isFollowGate ? 3 : 3)}
                                      title="Click to simulate user tapping the button in DMs"
                                      style={{
                                        alignSelf: 'flex-start',
                                        backgroundColor: previewStep === 2 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        color: previewStep === 2 ? '#60a5fa' : '#9ca3af',
                                        border: previewStep === 2 ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '16px',
                                        padding: '7px 12px',
                                        fontSize: '0.72rem',
                                        fontWeight: '600',
                                        cursor: previewStep === 2 ? 'pointer' : 'default',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        transition: 'all 0.2s',
                                        boxShadow: previewStep === 2 ? '0 0 10px rgba(59, 130, 246, 0.2)' : 'none'
                                      }}
                                    >
                                      <span>{dmRuleForm.entry_button_text || "➡️ Send me the Link!"}</span>
                                    </div>
                                    {previewStep === 2 && (
                                      <div style={{ fontSize: '0.62rem', color: '#60a5fa', fontStyle: 'italic', paddingLeft: '4px' }}>
                                        👆 Tap button above to simulate user interaction in DMs
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* User Outgoing Tap Bubble */}
                                {previewStep >= 3 && (
                                  <div style={{
                                    alignSelf: 'flex-end',
                                    background: 'linear-gradient(135deg, #a824e8, #c13584)',
                                    color: 'white',
                                    borderRadius: '14px',
                                    padding: '6px 12px',
                                    fontSize: '0.72rem',
                                    fontWeight: '500'
                                  }}>
                                    {dmRuleForm.entry_button_text || "➡️ Send me the Link!"}
                                  </div>
                                )}

                                {/* Follow Gate Step (if enabled) */}
                                {isFollowGate && previewStep >= 3 && (
                                  <>
                                    <div style={{
                                      alignSelf: 'flex-start',
                                      backgroundColor: '#262626',
                                      color: 'white',
                                      borderRadius: '16px',
                                      padding: '8px 12px',
                                      fontSize: '0.72rem',
                                      maxWidth: '88%'
                                    }}>
                                      {dmRuleForm.follow_intro_text || `Follow me here ➡️ @${followHandle}`}
                                    </div>

                                    <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
                                      <div style={{
                                        width: '210px',
                                        backgroundColor: '#1f2937',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        border: '1px solid #374151',
                                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '10px 12px',
                                        gap: '8px'
                                      }}>
                                        <div style={{ fontSize: '0.74rem', fontWeight: 'bold', color: 'white', lineHeight: '1.3' }}>
                                          {dmRuleForm.title || "➡️ You need to be following me to unlock this DM"}
                                        </div>
                                        <div style={{ fontSize: '0.66rem', color: '#9ca3af', lineHeight: '1.3' }}>
                                          {dmRuleForm.subtitle || "Once you’re following, click the button below to get the DM!"}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                          <div
                                            style={{
                                              backgroundColor: '#262626',
                                              color: '#ffffff',
                                              padding: '6px 0',
                                              borderRadius: '8px',
                                              fontSize: '0.7rem',
                                              fontWeight: '600',
                                              textAlign: 'center'
                                            }}
                                          >
                                            {dmRuleForm.follow_button_text || "Follow me here"}
                                          </div>
                                          <div
                                            onClick={() => previewStep === 3 && setPreviewStep(4)}
                                            style={{
                                              backgroundColor: previewStep === 3 ? 'rgba(16, 185, 129, 0.2)' : '#262626',
                                              color: '#34d399',
                                              padding: '6px 0',
                                              borderRadius: '8px',
                                              fontSize: '0.7rem',
                                              fontWeight: '600',
                                              textAlign: 'center',
                                              border: '1px solid rgba(16, 185, 129, 0.4)',
                                              cursor: previewStep === 3 ? 'pointer' : 'default',
                                              boxShadow: previewStep === 3 ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none'
                                            }}
                                          >
                                            {dmRuleForm.confirm_button_text || "✅ Send me the DM"}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {previewStep === 3 && (
                                      <div style={{ fontSize: '0.62rem', color: '#34d399', fontStyle: 'italic', paddingLeft: '4px' }}>
                                        👆 Tap "✅ Send me the DM" above to unlock link
                                      </div>
                                    )}
                                  </>
                                )}

                                {/* User Outgoing Confirm Tap Bubble */}
                                {isFollowGate && previewStep >= 4 && (
                                  <div style={{
                                    alignSelf: 'flex-end',
                                    background: 'linear-gradient(135deg, #a824e8, #c13584)',
                                    color: 'white',
                                    borderRadius: '14px',
                                    padding: '6px 12px',
                                    fontSize: '0.72rem',
                                    fontWeight: '500'
                                  }}>
                                    {dmRuleForm.confirm_button_text || "✅ Send me the DM"}
                                  </div>
                                )}

                                {/* Final Unlocked Link Card */}
                                {((isFollowGate && previewStep >= 4) || (!isFollowGate && previewStep >= 3)) && (
                                  <>
                                    <div style={{
                                      alignSelf: 'center',
                                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                                      border: '1px solid rgba(16, 185, 129, 0.3)',
                                      color: '#34d399',
                                      borderRadius: '12px',
                                      padding: '4px 10px',
                                      fontSize: '0.62rem',
                                      fontWeight: '600',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}>
                                      <span>🟢</span>
                                      <span>24-Hour Messaging Window Active • Meta Compliant</span>
                                    </div>

                                    <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
                                      <div style={{
                                        width: '210px',
                                        backgroundColor: '#1f2937',
                                        borderRadius: '14px',
                                        overflow: 'hidden',
                                        border: '1px solid #10b981',
                                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)',
                                        display: 'flex',
                                        flexDirection: 'column'
                                      }}>
                                        {dmRuleForm.image_url && (
                                          <div style={{
                                            width: '100%',
                                            height: '105px',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            backgroundColor: '#111827'
                                          }}>
                                            <img
                                              src={ensureAbsoluteUrl(dmRuleForm.image_url)}
                                              alt="Card Header"
                                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                              onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                          </div>
                                        )}

                                        <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                          <div style={{ fontSize: '0.72rem', color: '#f3f4f6', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                                            {dmRuleForm.message_text || dmRuleForm.reply_text || "Here is the link you requested 👇"}
                                          </div>
                                        </div>

                                        <a
                                          href={ensureAbsoluteUrl(dmRuleForm.link_url || dmRuleForm.button_url || 'https://google.com')}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            borderTop: '1px solid rgba(16, 185, 129, 0.3)',
                                            padding: '10px 0',
                                            color: '#10b981',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textAlign: 'center',
                                            backgroundColor: 'rgba(16, 185, 129, 0.08)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '4px',
                                            textDecoration: 'none'
                                          }}
                                        >
                                          <span>🔗</span>
                                          <span>{dmRuleForm.button_text || 'Open Link'}</span>
                                          <span style={{ fontSize: '0.65rem' }}>↗</span>
                                        </a>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </>
                            );
                          })()}
                        </div>

                        {/* Input Footer */}
                        <div style={{
                          height: '48px',
                          borderTop: '1px solid #1f2937',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#090d16'
                        }}>
                          <div style={{
                            flex: 1,
                            backgroundColor: '#1f2937',
                            borderRadius: '18px',
                            padding: '6px 12px',
                            color: '#6b7280',
                            fontSize: '0.68rem',
                            border: '1px solid #374151'
                          }}>
                            Message...
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                </div>
              </div>
            )}

            {deleteConfirmRuleId && (
              <div className="modal-overlay" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 3000,
                padding: '20px'
              }}>
                <div className="card" style={{
                  width: '100%',
                  maxWidth: '420px',
                  backgroundColor: '#111827',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    marginBottom: '8px'
                  }}>
                    ⚠️
                  </div>

                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'white', fontWeight: 'bold' }}>Delete Automation Rule</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                    Are you sure you want to delete this DM automation rule? This action cannot be undone and will stop this automation instantly.
                  </p>

                  <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '10px 16px', fontSize: '0.9rem', justifyContent: 'center' }}
                      onClick={() => setDeleteConfirmRuleId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ flex: 1, padding: '10px 16px', fontSize: '0.9rem', justifyContent: 'center', backgroundColor: '#ef4444', border: 'none', color: 'white' }}
                      onClick={handleConfirmDeleteDmRule}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}


        {/* Tab 7: Visual Flow Builder (Canvas) */}
        {activeTab === 'builder' && selectedFlow && (() => {
          const linkedPostInBuilder = getFlowLinkedPost(selectedFlow);
          return (
            <div>
              <div className="page-header" style={{ marginBottom: linkedPostInBuilder ? '12px' : '24px' }}>
                <div className="header-title">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h1>Flow Editor: {selectedFlow.name}</h1>
                    {linkedPostInBuilder && (
                      <span className={`badge ${linkedPostInBuilder.isFb ? 'badge-primary' : 'badge-success'}`} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        {linkedPostInBuilder.platformName} ({linkedPostInBuilder.accountName})
                      </span>
                    )}
                  </div>
                  <p>Manage automation node graph connections and keyword replies.</p>
                </div>
                <div className="header-actions">
                  <button className="btn btn-secondary" onClick={() => setActiveTab('flows')}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSaveFlow}><Save size={16} /> Sync Flow</button>
                </div>
              </div>

              {/* Future Flow Pending Banner in Flow Editor */}
              {selectedFlow.is_future_flow && !linkedPostInBuilder && selectedFlow.future_flow_status === 'pending' && (
                <div className="card" style={{
                  marginBottom: '20px',
                  padding: '14px 20px',
                  background: 'linear-gradient(135deg, rgba(217,119,6,0.12), rgba(180,83,9,0.06))',
                  border: '1px solid rgba(217,119,6,0.4)',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}>
                  <div style={{ fontSize: '2rem', flexShrink: 0 }}>⏳</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.5px', color: '#d97706', textTransform: 'uppercase' }}>
                      FUTURE FLOW — AWAITING PUBLICATION
                    </span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Compose your DM and it will be automatically attached to your next post or reel.
                    </p>
                    {selectedFlow.future_flow_last_scanned_at && (
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        🔍 Last scanned: {new Date(selectedFlow.future_flow_last_scanned_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                  {!selectedFlow.id.startsWith('flow_') && (
                    <button
                      className={`btn ${scanningFlowId === selectedFlow.id ? 'btn-disabled' : 'btn-secondary'}`}
                      onClick={() => handleScanFutureFlow(selectedFlow.id)}
                      disabled={scanningFlowId !== null}
                      style={{ fontSize: '0.8rem', border: '1px solid #d97706', color: '#d97706', flexShrink: 0, whiteSpace: 'nowrap' }}
                    >
                      {scanningFlowId === selectedFlow.id ? '🔄 Scanning...' : '🔍 Scan Now'}
                    </button>
                  )}
                </div>
              )}

              {/* Prominent Linked Post Banner inside Flow Editor */}
              {linkedPostInBuilder && (
                <div
                  onClick={() => handleOpenPostOnPlatform(linkedPostInBuilder)}
                  className="card"
                  style={{
                    marginBottom: '20px',
                    padding: '12px 18px',
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '14px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#818cf8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'; }}
                >
                  {linkedPostInBuilder.mediaUrl ? (
                    <img
                      src={linkedPostInBuilder.mediaUrl}
                      alt="Post preview"
                      style={{
                        width: '46px',
                        height: '46px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        border: '2px solid rgba(255,255,255,0.15)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        flexShrink: 0
                      }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}>
                      📷
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.5px', color: '#818cf8', textTransform: 'uppercase' }}>
                        📌 CONFIGURED FOR POST:
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        ID: {linkedPostInBuilder.postId}
                      </span>
                      {linkedPostInBuilder.timestamp && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          • Published {new Date(linkedPostInBuilder.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0, color: '#60a5fa' }}
                  >
                    Open Post on Platform ↗
                  </span>
                </div>
              )}

              <div className="builder-layout">
                {/* Node Graph Canvas Area */}
                <div className="canvas-area">
                  <div className="canvas-nodes-container">
                    {builderNodes.map((node, index) => {
                      const isSelected = selectedNode?.id === node.id;
                      return (
                        <div
                          key={node.id}
                          className={`node-card ${isSelected ? 'selected' : ''} ${node.type === 'trigger' ? 'trigger-node' :
                            node.type === 'action_reply' ? 'reply-node' :
                              node.type === 'action_dm' ? 'dm-node' : 'tag-node'
                            }`}
                          onClick={() => setSelectedNode(node)}
                        >
                          <div className="node-header">
                            {node.type === 'trigger' ? '🔑 Keyword Trigger' :
                              node.type === 'action_reply' ? '💬 Public Reply' :
                                node.type === 'action_dm' ? '✉️ Private DM' : '🏷️ Customer Tag'}
                          </div>
                          <div className="node-body">
                            {node.type === 'trigger' && (
                              <div>
                                <span>Triggers on:</span>
                                <div>
                                  {node.config.keywords?.map(kw => (
                                    <span key={kw} className="keyword-tag">{kw}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {node.type === 'action_reply' && (
                              <p style={{ fontStyle: 'italic', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>"{node.config.message || "@{{username}} Link sent! Check your messages 📩"}"</p>
                            )}
                            {node.type === 'action_dm' && (
                              <p style={{ fontStyle: 'italic', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{renderDmText(node.config.message)}</p>
                            )}
                            {node.type === 'action_tag' && (
                              <p>Apply Tag: <strong style={{ color: 'var(--warning)' }}>#{node.config.tag}</strong></p>
                            )}
                          </div>

                          {index < builderNodes.length - 1 && (
                            <div className="node-handle-out" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sidebar Settings Editor */}
                <div className="builder-sidebar">
                  <h3 style={{ marginBottom: '16px', fontSize: '1.05rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    Flow Settings
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
                    <div className="form-group">
                      <label>Flow Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedFlow.name}
                        onChange={(e) => setSelectedFlow(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Target Platform / Account</label>
                      <select
                        className="form-control"
                        value={selectedFlow.facebook_account_id ? `fb_${selectedFlow.facebook_account_id}` : selectedFlow.instagram_account_id ? `ig_${selectedFlow.instagram_account_id}` : ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val.startsWith('fb_')) {
                            const fbId = val.replace('fb_', '');
                            setSelectedFlow(prev => ({
                              ...prev,
                              facebook_account_id: isNaN(fbId) ? fbId : parseInt(fbId),
                              instagram_account_id: null
                            }));
                          } else if (val.startsWith('ig_')) {
                            const igId = val.replace('ig_', '');
                            setSelectedFlow(prev => ({
                              ...prev,
                              instagram_account_id: isNaN(igId) ? igId : parseInt(igId),
                              facebook_account_id: null
                            }));
                          }
                        }}
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px', width: '100%', fontSize: '0.85rem' }}
                      >
                        <option value="" disabled>-- Select Platform / Account --</option>
                        {accounts.map(acc => (
                          <option key={`ig_${acc.id}`} value={`ig_${acc.id}`} style={{ backgroundColor: '#111827' }}>
                            Instagram: @{acc.username}
                          </option>
                        ))}
                        {facebookAccounts.map(acc => (
                          <option key={`fb_${acc.id}`} value={`fb_${acc.id}`} style={{ backgroundColor: '#111827' }}>
                            Facebook Page: {acc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        id="flow-active-toggle"
                        checked={selectedFlow.is_active}
                        onChange={(e) => setSelectedFlow(prev => ({ ...prev, is_active: e.target.checked }))}
                      />
                      <label htmlFor="flow-active-toggle" style={{ margin: 0, cursor: 'pointer' }}>Active Status</label>
                    </div>
                    <div className="form-group">
                      <label>Linked to Specific Post</label>
                      {(() => {
                        const sidebarPost = getFlowLinkedPost(selectedFlow);
                        const currentLinkedPostId = selectedFlow.facebook_account_id
                          ? String(selectedFlow.facebook_post_id || (sidebarPost?.isFb ? sidebarPost.postId : "") || "")
                          : String(selectedFlow.instagram_post_id || (!sidebarPost?.isFb ? sidebarPost?.postId : "") || "");

                        const currentFilteredPosts = selectedFlow.facebook_account_id
                          ? [...facebookPosts].filter(p => !selectedFlow.facebook_account_id || Number(p.facebook_account_id) === Number(selectedFlow.facebook_account_id))
                          : [...posts].filter(p => !selectedFlow.instagram_account_id || Number(p.instagram_account_id) === Number(selectedFlow.instagram_account_id));

                        return (
                          <>
                            <select
                              className="form-control"
                              value={currentLinkedPostId}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (selectedFlow.facebook_account_id) {
                                  setSelectedFlow(prev => ({
                                    ...prev,
                                    facebook_post_id: val || null,
                                    instagram_post_id: null,
                                    is_future_flow: prev.is_future_flow
                                  }));
                                } else {
                                  setSelectedFlow(prev => ({
                                    ...prev,
                                    instagram_post_id: val || null,
                                    facebook_post_id: null,
                                    is_future_flow: prev.is_future_flow
                                  }));
                                }
                              }}
                              style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px', width: '100%', fontSize: '0.85rem' }}
                            >
                              <option value="">General (All Posts / Account-wide)</option>
                              {/* Fallback option if currently linked post is not in loaded posts array */}
                              {currentLinkedPostId && !currentFilteredPosts.some(p => String(p.id) === currentLinkedPostId) && (
                                <option value={currentLinkedPostId} style={{ backgroundColor: '#111827' }}>
                                  Post: {sidebarPost?.caption ? (sidebarPost.caption.slice(0, 40) + "...") : currentLinkedPostId} ({currentLinkedPostId})
                                </option>
                              )}
                              {selectedFlow.facebook_account_id ? (
                                currentFilteredPosts
                                  .sort((a, b) => (b.timestamp ? new Date(b.timestamp).getTime() : 0) - (a.timestamp ? new Date(a.timestamp).getTime() : 0))
                                  .map(p => (
                                    <option key={String(p.id)} value={String(p.id)} style={{ backgroundColor: '#111827' }}>
                                      Post: {p.caption ? (p.caption.slice(0, 40) + "...") : "No Caption"} ({p.id})
                                    </option>
                                  ))
                              ) : (
                                currentFilteredPosts
                                  .sort((a, b) => (b.timestamp ? new Date(b.timestamp).getTime() : 0) - (a.timestamp ? new Date(a.timestamp).getTime() : 0))
                                  .map(p => (
                                    <option key={String(p.id)} value={String(p.id)} style={{ backgroundColor: '#111827' }}>
                                      Post: {p.caption ? (p.caption.slice(0, 40) + "...") : "No Caption"} ({p.id})
                                    </option>
                                  ))
                              )}
                            </select>

                            {/* Live Sidebar Post Preview */}
                            {sidebarPost && (
                              <div style={{
                                marginTop: '10px',
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                              }}>
                                {sidebarPost.mediaUrl ? (
                                  <img
                                    src={sidebarPost.mediaUrl}
                                    alt="Thumbnail"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)', flexShrink: 0 }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                ) : (
                                  <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#9ca3af', flexShrink: 0 }}>
                                    📷
                                  </div>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'white', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {sidebarPost.caption || `Post ${sidebarPost.postId}`}
                                  </p>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                    ID: {sidebarPost.postId}
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────── */}
                  {/* FUTURE FLOW SECTION (Hidden on Post Specific Flows) */}
                  {/* ─────────────────────────────────────────────── */}
                  {(() => {
                    const isExplicitPostFlow = Boolean(selectedFlow.name?.startsWith("Post Flow: "));

                    // Post-specific flows do not need Future Flow options
                    if (isExplicitPostFlow || !selectedFlow.is_future_flow) return null;

                    return (
                      <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                          <h3 style={{ margin: 0, fontSize: '1.05rem' }}>
                            ⏳ Future Flow
                          </h3>
                          {selectedFlow.future_flow_status && (
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              padding: '3px 10px',
                              borderRadius: '4px',
                              background: selectedFlow.future_flow_status === 'resolved'
                                ? 'linear-gradient(135deg, #059669, #047857)'
                                : 'linear-gradient(135deg, #d97706, #b45309)',
                              color: 'white'
                            }}>
                              {selectedFlow.future_flow_status === 'resolved' ? '✅ Resolved' : '⏳ Awaiting Post'}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          {selectedFlow.future_flow_last_scanned_at && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              Last scan: {new Date(selectedFlow.future_flow_last_scanned_at).toLocaleTimeString()}
                            </span>
                          )}

                          {/* DM Attachment Notice & Apply to all future posts option */}
                          <div style={{ margin: '4px 0 8px 0' }}>
                            <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                              Compose your DM below and it will be automatically attached to your next post or reel.{' '}
                              <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); addToast("When enabled, this automation attaches to the next published post on your connected channel.", "info"); }}
                                style={{ color: '#3b82f6', textDecoration: 'underline', cursor: 'pointer' }}
                              >
                                Learn more
                              </a>
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <input
                                type="checkbox"
                                id="apply-all-future-posts"
                                checked={!!selectedFlow.apply_to_all_future_posts}
                                onChange={(e) => setSelectedFlow(prev => ({ ...prev, apply_to_all_future_posts: e.target.checked }))}
                                style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: '#007bff' }}
                              />
                              <label htmlFor="apply-all-future-posts" style={{ fontSize: '0.88rem', color: 'white', cursor: 'pointer', margin: 0, fontWeight: '500' }}>
                                Apply Next Post to all future posts
                              </label>
                            </div>
                          </div>

                          {/* Manual scan button */}
                          {!selectedFlow.id.startsWith('flow_') && (selectedFlow.future_flow_status !== 'resolved' || selectedFlow.apply_to_all_future_posts) && (
                            <button
                              type="button"
                              className={`btn ${scanningFlowId === selectedFlow.id ? 'btn-disabled' : 'btn-secondary'}`}
                              onClick={() => handleScanFutureFlow(selectedFlow.id)}
                              disabled={scanningFlowId !== null}
                              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem', border: '1px solid #d97706', color: '#d97706' }}
                            >
                              {scanningFlowId === selectedFlow.id ? '🔄 Scanning for post...' : '🔍 Scan for Post Now'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  <h3 style={{ marginBottom: '16px', fontSize: '1.05rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    Node Settings
                  </h3>

                  {selectedNode ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
                      <div className="form-group">
                        <label>Node ID</label>
                        <input type="text" className="form-control" value={selectedNode.id} disabled />
                      </div>

                      {selectedNode.type === 'trigger' && (
                        <div>
                          <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Keyword Triggers</label>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Comment must contain:</span>

                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '6px',
                                padding: '8px 12px',
                                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-sm)',
                                minHeight: '44px',
                                alignItems: 'center',
                                cursor: 'text'
                              }}
                              onClick={() => document.getElementById('keyword-tag-input')?.focus()}
                            >
                              {(selectedNode.config.keywords || []).map((keyword, index) => (
                                <div
                                  key={index}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    fontSize: '0.88rem',
                                    fontWeight: '500'
                                  }}
                                >
                                  <span>{keyword}</span>
                                  <span
                                    style={{ cursor: 'pointer', opacity: 0.8, fontSize: '0.8rem', fontWeight: 'bold', marginLeft: '4px' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const updated = (selectedNode.config.keywords || []).filter((_, i) => i !== index);
                                      handleUpdateNodeConfig('keywords', updated);
                                    }}
                                  >
                                    ✕
                                  </span>
                                </div>
                              ))}

                              <input
                                id="keyword-tag-input"
                                type="text"
                                placeholder={(selectedNode.config.keywords || []).length === 0 ? "Type keyword & press Enter" : ""}
                                style={{
                                  border: 'none',
                                  outline: 'none',
                                  background: 'transparent',
                                  color: 'var(--text-primary)',
                                  fontSize: '0.95rem',
                                  flexGrow: 1,
                                  minWidth: '120px',
                                  padding: '4px 0'
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    const val = e.target.value.trim();
                                    if (val) {
                                      const currentKeywords = selectedNode.config.keywords || [];
                                      if (currentKeywords.length < 30 && !currentKeywords.includes(val)) {
                                        handleUpdateNodeConfig('keywords', [...currentKeywords, val]);
                                      }
                                      e.target.value = '';
                                    }
                                  } else if (e.key === 'Backspace' && !e.target.value) {
                                    const currentKeywords = selectedNode.config.keywords || [];
                                    if (currentKeywords.length > 0) {
                                      handleUpdateNodeConfig('keywords', currentKeywords.slice(0, -1));
                                    }
                                  }
                                }}
                              />
                            </div>

                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                              {30 - (selectedNode.config.keywords || []).length} of 30 remaining
                            </span>
                          </div>
                          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="checkbox"
                              checked={selectedNode.config.exact_word}
                              onChange={(e) => handleUpdateNodeConfig('exact_word', e.target.checked)}
                            />
                            <label style={{ margin: 0 }}>Exact Word Boundary Match</label>
                          </div>
                        </div>
                      )}

                      {selectedNode.type === 'action_reply' && (
                        <div className="form-group">
                          <label>Message Content (supports `{"{{username}}"}`)</label>
                          <textarea
                            className="form-control"
                            rows="4"
                            value={
                              selectedNode.config.message ||
                              "@{{username}} Link sent! Check your messages 📩"
                            }
                            placeholder="Enter your message"
                            onChange={(e) => handleUpdateNodeConfig('message', e.target.value)}
                          />
                        </div>
                      )}

                      {selectedNode.type === 'action_dm' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div className="form-group">
                            <label>Link with Personal DM Draft / Template</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <select
                                className="form-control"
                                style={{ flex: 1 }}
                                value={selectedNode.config.dm_automation_id || 'custom'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === 'custom') {
                                    handleUpdateNodeConfig('dm_automation_id', '');
                                    handleUpdateNodeConfig('message', 'Write a direct message link...');
                                  } else {
                                    const matchedRule = dmRules.find(r => r.id.toString() === val.toString());
                                    if (matchedRule) {
                                      handleUpdateNodeConfig('dm_automation_id', matchedRule.id);
                                      handleUpdateNodeConfig('message', matchedRule.reply_text);
                                    }
                                  }
                                }}
                              >
                                <option value="custom">Custom Message (Plain Text)</option>
                                {dmRules.map(rule => (
                                  <option key={rule.id} value={rule.id}>
                                    {rule.name} ({rule.trigger_type.replace('_', ' ')})
                                  </option>
                                ))}
                              </select>
                              {selectedNode.config.dm_automation_id && selectedNode.config.dm_automation_id !== 'custom' && (
                                <button
                                  className="btn btn-secondary btn-sm"
                                  type="button"
                                  style={{ height: '38px', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                                  onClick={() => {
                                    const matchedRule = dmRules.find(r => r.id.toString() === selectedNode.config.dm_automation_id.toString());
                                    if (matchedRule) {
                                      setPreviewDmRule(matchedRule);
                                    }
                                  }}
                                >
                                  👁️ Preview
                                </button>
                              )}
                            </div>
                          </div>

                          {(!selectedNode.config.dm_automation_id || selectedNode.config.dm_automation_id === 'custom') ? (
                            <div className="form-group">
                              <label>Message Content (supports `{"{{username}}"}`)</label>
                              <textarea
                                className="form-control"
                                rows="4"
                                value={selectedNode.config.message}
                                onChange={(e) => handleUpdateNodeConfig('message', e.target.value)}
                              />
                            </div>
                          ) : (
                            <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 'bold' }}>Linked Template Details</div>
                              {(() => {
                                try {
                                  const msg = selectedNode.config.message || '';
                                  if (msg.trim().startsWith('{') && msg.trim().endsWith('}')) {
                                    const parsed = JSON.parse(msg);
                                    return (
                                      <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div><strong>Type:</strong> <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>{parsed.dm_type || 'link_dm'}</span></div>
                                        {parsed.entry_message && <div><strong>DM Entry:</strong> {parsed.entry_message}</div>}
                                        {parsed.entry_button_text && <div><strong>Entry Button:</strong> {parsed.entry_button_text}</div>}
                                        <div><strong>Link DM Text:</strong> {parsed.message_text || parsed.text || parsed.reply_text}</div>
                                        {parsed.button_text && <div><strong>Destination:</strong> {parsed.button_text} ({parsed.link_url || parsed.button_url})</div>}
                                        {parsed.image_url && <div><strong>Image:</strong> <a href={ensureAbsoluteUrl(parsed.image_url)} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>View Attached Image</a></div>}
                                      </div>
                                    );
                                  }
                                } catch (err) { }
                                return <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{selectedNode.config.message}</div>;
                              })()}
                            </div>
                          )}
                        </div>
                      )}

                      {selectedNode.type === 'action_tag' && (
                        <div className="form-group">
                          <label>Contact Tag Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedNode.config.tag}
                            onChange={(e) => handleUpdateNodeConfig('tag', e.target.value)}
                          />
                        </div>
                      )}

                      <button
                        className="btn btn-danger"
                        style={{ marginTop: 'auto', width: '100%' }}
                        onClick={() => handleDeleteNode(selectedNode.id)}
                      >
                        Delete Node
                      </button>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', margin: 'auto' }}>
                      Select a node on the canvas to configure settings.
                    </p>
                  )}

                  <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                    <h4 style={{ fontSize: '0.88rem', marginBottom: '12px' }}>Add Actions</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button className="btn btn-secondary" style={{ fontSize: '0.82rem', justifyContent: 'flex-start' }} onClick={() => handleAddNode('action_reply')}>
                        + Public Reply
                      </button>
                      <button className="btn btn-secondary" style={{ fontSize: '0.82rem', justifyContent: 'flex-start' }} onClick={() => handleAddNode('action_dm')}>
                        + Private DM Link
                      </button>
                      <button className="btn btn-secondary" style={{ fontSize: '0.82rem', justifyContent: 'flex-start' }} onClick={() => handleAddNode('action_tag')}>
                        + Add Customer Tag
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {isGuideOpen && (
          <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            padding: '20px'
          }}>
            <div className="card" style={{
              width: '100%',
              maxWidth: '750px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#111827',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              padding: '28px'
            }}>
              <button
                onClick={() => setIsGuideOpen(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              >
                &times;
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: 'var(--primary-color)',
                  padding: '10px',
                  borderRadius: '10px'
                }}>
                  <Info size={24} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>Automation Flows User Guide</h2>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Guides for Post-Specific Flows, Future Post Flows, and Custom Response Chains.</p>
                </div>
              </div>

              {/* Guide Category Tabs */}
              <div style={{
                display: 'flex',
                gap: '8px',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '20px',
                paddingBottom: '8px',
                flexWrap: 'wrap'
              }}>
                <button
                  type="button"
                  onClick={() => setGuideTab('post_flow')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: guideTab === 'post_flow' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: guideTab === 'post_flow' ? '#60a5fa' : 'var(--text-muted)',
                    borderBottom: guideTab === 'post_flow' ? '2px solid #3b82f6' : '2px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <Link2 size={16} /> Post-Specific Flow
                </button>
                <button
                  type="button"
                  onClick={() => setGuideTab('future_flow')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: guideTab === 'future_flow' ? 'rgba(217, 119, 6, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: guideTab === 'future_flow' ? '#fbbf24' : 'var(--text-muted)',
                    borderBottom: guideTab === 'future_flow' ? '2px solid #d97706' : '2px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <Clock size={16} /> Future Post Flow
                </button>
                <button
                  type="button"
                  onClick={() => setGuideTab('all')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: guideTab === 'all' ? 'rgba(147, 51, 234, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: guideTab === 'all' ? '#c084fc' : 'var(--text-muted)',
                    borderBottom: guideTab === 'all' ? '2px solid #9333ea' : '2px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <GitFork size={16} /> Flow Builder & Triggers
                </button>
              </div>

              <div className="guide-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>

                {/* TAB 1: POST SPECIFIC FLOW GUIDE */}
                {guideTab === 'post_flow' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link2 size={18} style={{ color: '#60a5fa' }} /> Post-Specific Automation Guide
                      </h3>
                      <p style={{ margin: 0 }}>
                        Post-specific flows link triggers and automated DM chains strictly to an <strong>individual published Instagram Post or Reel</strong>. Comments on other posts will never trigger this flow.
                      </p>
                    </div>

                    {/* Visual Steps Walkthrough */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.05)',
                      textAlign: 'center',
                      gap: '8px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#60a5fa', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Step 1: Select Post</div>
                        <div style={{ color: 'white', fontWeight: 500, fontSize: '0.85rem' }}>Media & Feed</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Choose Post/Reel</div>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontWeight: 700 }}>➔</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#60a5fa', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Step 2: Trigger</div>
                        <div style={{ color: 'white', fontWeight: 500, fontSize: '0.85rem' }}>Keyword "price"</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Matches on this post only</div>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontWeight: 700 }}>➔</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#60a5fa', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Step 3: Public Reply</div>
                        <div style={{ color: 'white', fontWeight: 500, fontSize: '0.85rem' }}>Auto Comment</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@user Check your DMs 📩</div>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontWeight: 700 }}>➔</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#60a5fa', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Step 4: DM Card</div>
                        <div style={{ color: 'white', fontWeight: 500, fontSize: '0.85rem' }}>Direct Message</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Card with "Link" button</div>
                      </div>
                    </div>

                    {/* How to Setup Steps */}
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                      <h4 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '1rem' }}>How to Create a Post-Specific Flow:</h4>
                      <ol style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li>Go to <strong>Media & Feed</strong> in the sidebar.</li>
                        <li>Locate your Post or Reel, and click <strong>Post Automation</strong> (or use the <strong>Post Specific Flow</strong> tab).</li>
                        <li>The flow builder opens pre-configured with the trigger keyword: <strong>"price"</strong> (or custom keyword).</li>
                        <li>Customize your <strong>Public Reply Node</strong> (e.g. <code>@&#123;&#123;username&#125;&#125; Thanks for commenting! Check your DMs 📩</code>).</li>
                        <li>Customize your <strong>Private DM Node</strong>: Specify the card title, description, and destination URL for the <strong>"Link"</strong> button.</li>
                        <li>Ensure the flow status toggle is set to <strong>Active</strong> and click <strong>Save Flow</strong>.</li>
                      </ol>
                    </div>

                    {/* Tracking & Metrics */}
                    <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '14px', borderRadius: '10px' }}>
                      <div style={{ color: '#93c5fd', fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>📊 Accurate Dashboard Metrics</div>
                      <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: '1.5' }}>
                        When a follower comments <strong>"price"</strong> on your post, the system matches only that keyword, logging <strong>1 match</strong> in your Dashboard's <em>Keyword Performance metrics</em>. Un-triggered keywords like <strong>"info"</strong> accurately remain at <strong>0</strong>.
                      </p>
                    </div>

                    {/* Pro Tip */}
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <strong style={{ color: 'white', fontSize: '0.85rem' }}>💡 Best Practice Tip:</strong>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem' }}>
                        Include a clear call to action in your post caption: <em>"Comment 'price' below to get the exclusive link sent right to your DMs!"</em>
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: FUTURE POST FLOW GUIDE */}
                {guideTab === 'future_flow' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={18} style={{ color: '#fbbf24' }} /> Future Post Automation Guide
                      </h3>
                      <p style={{ margin: 0 }}>
                        Future Post flows let you pre-configure your comment & DM automation chains <strong>before</strong> your upcoming Reel or scheduled post is published on Instagram or Facebook.
                      </p>
                    </div>

                    {/* Visual Steps Walkthrough */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.05)',
                      textAlign: 'center',
                      gap: '8px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#fbbf24', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Step 1: Pre-Configure</div>
                        <div style={{ color: 'white', fontWeight: 500, fontSize: '0.85rem' }}>Create Future Flow</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: ⏳ Pending</div>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontWeight: 700 }}>➔</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#fbbf24', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Step 2: Match Rule</div>
                        <div style={{ color: 'white', fontWeight: 500, fontSize: '0.85rem' }}>Caption Keywords</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>or "Apply to All"</div>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontWeight: 700 }}>➔</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#fbbf24', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Step 3: Publish Post</div>
                        <div style={{ color: 'white', fontWeight: 500, fontSize: '0.85rem' }}>Post on Instagram</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>App or Meta Suite</div>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontWeight: 700 }}>➔</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#fbbf24', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Step 4: Auto-Resolve</div>
                        <div style={{ color: 'white', fontWeight: 500, fontSize: '0.85rem' }}>Flow Activates</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: ✅ Resolved</div>
                      </div>
                    </div>

                    {/* How to Setup Steps */}
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                      <h4 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '1rem' }}>How to Configure Future Post Automation:</h4>
                      <ol style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <li>Navigate to <strong>Future Post</strong> under Features in the sidebar.</li>
                        <li>Click <strong>Create Future Post Flow</strong>.</li>
                        <li>Select your connected <strong>Instagram Business Account</strong> or <strong>Facebook Page</strong>.</li>
                        <li>Choose how the system should identify your upcoming post:
                          <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                            <li><strong>Match by Caption:</strong> Type expected words from your caption (e.g. <em>"Rag System"</em> or <em>"AI verse"</em>). The scanner performs fuzzy similarity matching.</li>
                            <li><strong>Apply to All Future Posts:</strong> Enable this toggle if you want this flow to attach automatically to <em>every</em> post published going forward.</li>
                          </ul>
                        </li>
                        <li>Set your trigger keyword (e.g. <code>price</code> or <code>link</code>), public comment reply, and private DM card.</li>
                        <li>Save the flow. It sits in <strong>⏳ Pending</strong> state waiting for the post to publish.</li>
                        <li>When you publish your post, the background scanner (running every <strong>30 seconds</strong>) detects it and updates the flow to <strong>✅ Resolved (Active)</strong>!</li>
                      </ol>
                    </div>

                    {/* Scan Now Feature */}
                    <div style={{ backgroundColor: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.25)', padding: '14px', borderRadius: '10px' }}>
                      <div style={{ color: '#fcd34d', fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>⚡ Instant Scan On Demand</div>
                      <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: '1.5' }}>
                        Need immediate activation without waiting for the automatic scan? Simply click <strong>"Scan for Post Now"</strong> on any pending future flow card to trigger an immediate discovery scan from Meta Graph API.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 3: VISUAL FLOW BUILDER & TRIGGERS */}
                {guideTab === 'all' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <GitFork size={18} style={{ color: '#c084fc' }} /> Visual Flow Builder & Triggers
                      </h3>
                      <p style={{ margin: 0 }}>
                        Build powerful multi-step automated response chains by connecting visual nodes.
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                      <h4 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '1rem' }}>Available Node Types:</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <strong style={{ color: '#60a5fa', fontSize: '0.85rem' }}>1. Trigger Node</strong>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem' }}>
                            Detects incoming comments. Configure one or more keywords (e.g. <code>price</code>, <code>link</code>). Choose <strong>Exact Word</strong> for strict boundary matches, or fuzzy match for substrings.
                          </p>
                        </div>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <strong style={{ color: '#34d399', fontSize: '0.85rem' }}>2. Public Reply Node</strong>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem' }}>
                            Publishes an automated public reply to the comment. Use <code>@&#123;&#123;username&#125;&#125;</code> to tag the commenter directly.
                          </p>
                        </div>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <strong style={{ color: '#f472b6', fontSize: '0.85rem' }}>3. Private DM Node</strong>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem' }}>
                            Sends a direct message card containing title, description, and an action button labeled <strong>"Link"</strong> directing followers to your URL.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <strong style={{ color: 'white', fontSize: '0.85rem' }}>💡 Fast 30-Second Polling:</strong>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem' }}>
                        The automation engine scans for new comments every <strong>30 seconds</strong> in the background, providing fast, responsive comment handling.
                      </p>
                    </div>
                  </div>
                )}

              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button className="btn btn-primary" onClick={() => setIsGuideOpen(false)}>Got It, Close Guide</button>
              </div>

            </div>
          </div>
        )}

        {deleteConfirmFlowId && (
          <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3000,
            padding: '20px'
          }}>
            <div className="card" style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#111827',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                ⚠️
              </div>

              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'white', fontWeight: 'bold' }}>Delete Automation Flow</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                Are you sure you want to delete this automation flow? This action cannot be undone and will stop this automation instantly.
              </p>

              <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '10px 16px', fontSize: '0.9rem', justifyContent: 'center' }}
                  onClick={() => setDeleteConfirmFlowId(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{ flex: 1, padding: '10px 16px', fontSize: '0.9rem', justifyContent: 'center', backgroundColor: '#ef4444', border: 'none', color: 'white' }}
                  onClick={handleConfirmDeleteFlow}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {previewDmRule && (
          <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3000,
            padding: '20px'
          }}>
            <div className="card" style={{
              width: '100%',
              maxWidth: '360px',
              backgroundColor: '#111827',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>Template Preview</h3>
                <button
                  style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.2rem' }}
                  onClick={() => setPreviewDmRule(null)}
                >
                  ✕
                </button>
              </div>

              {/* Phone container */}
              <div style={{
                width: '280px',
                height: '520px',
                borderRadius: '36px',
                border: '12px solid #1f2937',
                backgroundColor: '#030712',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Notch */}
                <div style={{
                  width: '110px',
                  height: '18px',
                  backgroundColor: '#1f2937',
                  borderBottomLeftRadius: '12px',
                  borderBottomRightRadius: '12px',
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 10
                }} />

                {/* Header */}
                <div style={{
                  height: '56px',
                  borderBottom: '1px solid #1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 12px 0 12px',
                  gap: '8px',
                  backgroundColor: '#090d16'
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>❮</div>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    ig
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'white' }}>
                      {accounts.find(a => a.id === previewDmRule.instagram_account_id)?.username ? `@${accounts.find(a => a.id === previewDmRule.instagram_account_id)?.username}` : 'instagram_page'}
                    </span>
                    <span style={{ fontSize: '0.6rem', color: '#6b7280' }}>Active now</span>
                  </div>
                </div>

                {/* Chat Message Panel */}
                <div style={{
                  flex: 1,
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  overflowY: 'auto',
                  backgroundColor: '#030712'
                }}>
                  {(() => {
                    let parsed = null;
                    try {
                      parsed = JSON.parse(previewDmRule.reply_text);
                    } catch (e) { }

                    const accountUsername = accounts.find(a => a.id === previewDmRule.instagram_account_id)?.username || 'Account';

                    if (parsed && (parsed.dm_type === 'link_dm' || parsed.dm_type === 'button_template' || parsed.dm_type === 'follow_gate' || parsed.require_follow)) {
                      const isFollowGate = Boolean(parsed.dm_type === 'follow_gate' || parsed.require_follow);
                      const followHandle = parsed.follow_username || accountUsername || 'rish.jain89';

                      return (
                        <>
                          {/* Top comment notice */}
                          <div style={{
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '10px',
                            padding: '8px 10px',
                            fontSize: '0.65rem',
                            color: '#a1a1aa',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{ fontSize: '1rem' }}>💬</span>
                            <div style={{ flex: 1, lineHeight: '1.2' }}>
                              <span style={{ color: 'white', fontWeight: 'bold' }}>@{accountUsername}</span> messaged you about a comment you made on their post.
                            </div>
                            <span style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '0.62rem' }}>See Post</span>
                          </div>

                          {/* Trigger word bubble */}
                          <div style={{
                            alignSelf: 'flex-start',
                            backgroundColor: '#1f2937',
                            color: 'white',
                            borderRadius: '14px',
                            padding: '6px 10px',
                            fontSize: '0.7rem'
                          }}>
                            💬 Commented: "{previewDmRule.keyword || "link please! 🔥"}"
                          </div>

                          {/* Step 1: Bot Private Reply / DM Entry */}
                          <div style={{ alignSelf: 'flex-start', maxWidth: '88%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{
                              backgroundColor: '#262626',
                              color: 'white',
                              borderRadius: '16px',
                              padding: '10px 12px',
                              fontSize: '0.73rem',
                              lineHeight: '1.4',
                              whiteSpace: 'pre-wrap'
                            }}>
                              {parsed.entry_message || parsed.step1_text || parsed.text || "👋 Thanks for the comment.\n\nTap the button below and I'll send you the link right away!\nReply STOP to opt-out"}
                            </div>
                            <div style={{
                              alignSelf: 'flex-start',
                              backgroundColor: 'rgba(59, 130, 246, 0.15)',
                              color: '#60a5fa',
                              border: '1px solid rgba(59, 130, 246, 0.35)',
                              borderRadius: '16px',
                              padding: '7px 12px',
                              fontSize: '0.72rem',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <span>{parsed.entry_button_text || parsed.step1_button_text || "➡️ Send me the Link!"}</span>
                            </div>
                          </div>

                          {/* Step 2: User Tap Response */}
                          <div style={{
                            alignSelf: 'flex-end',
                            background: 'linear-gradient(135deg, #a824e8, #c13584)',
                            color: 'white',
                            borderRadius: '14px',
                            padding: '6px 12px',
                            fontSize: '0.72rem',
                            fontWeight: '500'
                          }}>
                            {parsed.entry_button_text || parsed.step1_button_text || "➡️ Send me the Link!"}
                          </div>

                          {/* If Follow Gate is enabled, render the Follow-to-Unlock step */}
                          {isFollowGate && (
                            <>
                              {/* Bot Step 2: Follow Handle Prompt Bubble */}
                              <div style={{
                                alignSelf: 'flex-start',
                                backgroundColor: '#262626',
                                color: 'white',
                                borderRadius: '16px',
                                padding: '8px 12px',
                                fontSize: '0.73rem',
                                maxWidth: '88%'
                              }}>
                                {parsed.follow_intro_text || `Follow me here ➡️ @${followHandle}`}
                              </div>

                              {/* Bot Step 2: Follow Gate Card (Follow Me Here + Send Me the DM) */}
                              <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
                                <div style={{
                                  width: '220px',
                                  backgroundColor: '#1f2937',
                                  borderRadius: '16px',
                                  overflow: 'hidden',
                                  border: '1px solid #374151',
                                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  padding: '12px',
                                  gap: '10px'
                                }}>
                                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'white', lineHeight: '1.3' }}>
                                    {parsed.title || "➡️ You need to be following me to unlock this DM"}
                                  </div>
                                  <div style={{ fontSize: '0.68rem', color: '#9ca3af', lineHeight: '1.3' }}>
                                    {parsed.subtitle || "Once you’re following, click the button below to get the DM!"}
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <a
                                      href={ensureAbsoluteUrl(parsed.follow_url || `https://instagram.com/${followHandle}`)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        backgroundColor: '#262626',
                                        color: '#ffffff',
                                        padding: '7px 0',
                                        borderRadius: '8px',
                                        fontSize: '0.72rem',
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        display: 'block'
                                      }}
                                    >
                                      {parsed.follow_button_text || "Follow me here"}
                                    </a>
                                    <div
                                      style={{
                                        backgroundColor: '#262626',
                                        color: '#34d399',
                                        padding: '7px 0',
                                        borderRadius: '8px',
                                        fontSize: '0.72rem',
                                        fontWeight: '600',
                                        textAlign: 'center',
                                        border: '1px solid rgba(16, 185, 129, 0.3)'
                                      }}
                                    >
                                      {parsed.confirm_button_text || "✅ Send me the DM"}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* User Response to Follow Gate */}
                              <div style={{
                                alignSelf: 'flex-end',
                                background: 'linear-gradient(135deg, #a824e8, #c13584)',
                                color: 'white',
                                borderRadius: '14px',
                                padding: '6px 12px',
                                fontSize: '0.72rem',
                                fontWeight: '500'
                              }}>
                                {parsed.confirm_button_text || "✅ Send me the DM"}
                              </div>
                            </>
                          )}

                          {/* Meta Compliance Badge */}
                          <div style={{
                            alignSelf: 'center',
                            backgroundColor: 'rgba(16, 185, 129, 0.12)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            color: '#34d399',
                            borderRadius: '12px',
                            padding: '4px 10px',
                            fontSize: '0.62rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <span>🟢</span>
                            <span>24-Hour Messaging Window Active • Meta Compliant</span>
                          </div>

                          {/* Step 3: Delivered Link DM Card */}
                          <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
                            <div style={{
                              width: '220px',
                              backgroundColor: '#1f2937',
                              borderRadius: '14px',
                              overflow: 'hidden',
                              border: '1px solid #10b981',
                              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)',
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              {parsed.image_url && (
                                <div style={{
                                  width: '100%',
                                  height: '110px',
                                  overflow: 'hidden',
                                  position: 'relative',
                                  backgroundColor: '#111827'
                                }}>
                                  <img
                                    src={ensureAbsoluteUrl(parsed.image_url)}
                                    alt="Card Header"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                </div>
                              )}
                              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ fontSize: '0.72rem', color: '#f3f4f6', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                                  {parsed.message_text || parsed.text || "Here is the link you requested 👇"}
                                </div>
                              </div>
                              <a
                                href={ensureAbsoluteUrl(parsed.link_url || parsed.button_url || '#')}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  borderTop: '1px solid rgba(16, 185, 129, 0.3)',
                                  padding: '10px 0',
                                  color: '#10b981',
                                  fontSize: '0.75rem',
                                  fontWeight: '700',
                                  textAlign: 'center',
                                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px',
                                  textDecoration: 'none'
                                }}
                              >
                                <span>🔗</span>
                                <span>{parsed.button_text || 'Open Link'}</span>
                                <span style={{ fontSize: '0.65rem' }}>↗</span>
                              </a>
                            </div>
                          </div>
                        </>
                      );
                    }

                    return (
                      <>
                        {previewDmRule.keyword && (
                          <div style={{
                            alignSelf: 'flex-start',
                            backgroundColor: '#1f2937',
                            color: 'white',
                            borderRadius: '14px',
                            padding: '8px 12px',
                            fontSize: '0.72rem',
                            maxWidth: '80%',
                            wordBreak: 'break-word'
                          }}>
                            {previewDmRule.keyword}
                          </div>
                        )}

                        <div style={{ alignSelf: 'flex-end', maxWidth: '85%' }}>
                          {parsed && parsed.dm_type === 'image' ? (
                            <div style={{
                              width: '180px',
                              borderRadius: '14px',
                              overflow: 'hidden',
                              border: '1px solid #374151',
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              <img
                                src={parsed.image_url ? ensureAbsoluteUrl(parsed.image_url) : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500'}
                                alt="Preview"
                                style={{ width: '100%', height: 'auto', maxHeight: '180px', objectFit: 'cover' }}
                              />
                              {parsed.text && (
                                <div style={{ padding: '6px 10px', fontSize: '0.72rem', color: 'white', backgroundColor: '#3b82f6' }}>
                                  {parsed.text}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              borderRadius: '14px',
                              padding: '8px 12px',
                              fontSize: '0.72rem',
                              wordBreak: 'break-word'
                            }}>
                              {previewDmRule.reply_text || "Welcome!"}
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Footer input */}
                <div style={{
                  height: '48px',
                  borderTop: '1px solid #1f2937',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#090d16'
                }}>
                  <div style={{
                    flex: 1,
                    backgroundColor: '#1f2937',
                    borderRadius: '18px',
                    height: '28px',
                    padding: '0 12px',
                    fontSize: '0.68rem',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    Message...
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setPreviewDmRule(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Custom Confirmation Modal */}
      {confirmModalState.isOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '20px'
        }}>
          <div className="card" style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: '#161622',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: confirmModalState.variant === 'danger' ? 'rgba(255, 45, 85, 0.15)' : 'rgba(0, 123, 255, 0.15)',
                color: confirmModalState.variant === 'danger' ? '#ff2d55' : '#007bff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {confirmModalState.title || "Confirm Action"}
                </h3>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {confirmModalState.message}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={() => setConfirmModalState(prev => ({ ...prev, isOpen: false }))}
                className="btn btn-secondary"
                style={{ padding: '8px 18px', fontSize: '0.85rem', fontWeight: '600' }}
              >
                {confirmModalState.cancelText || "Cancel"}
              </button>
              <button
                onClick={() => {
                  if (confirmModalState.onConfirm) confirmModalState.onConfirm();
                  setConfirmModalState(prev => ({ ...prev, isOpen: false }));
                }}
                style={{
                  padding: '8px 18px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  backgroundColor: confirmModalState.variant === 'danger' ? '#ff2d55' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {confirmModalState.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

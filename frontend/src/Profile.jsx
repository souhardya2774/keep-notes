import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaTrash, FaChartBar, FaStickyNote, FaTags, FaThumbtack, FaArchive } from 'react-icons/fa';
import api from './api/api';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [profileResponse, statsResponse] = await Promise.all([
        api.get('/profile'),
        api.get('/profile/stats')
      ]);

      setProfile(profileResponse.data.data);
      setStats(statsResponse.data.data);
      setEditName(profileResponse.data.data.name || '');
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Show alert message
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      showAlert('error', 'Name cannot be empty');
      return;
    }

    try {
      setSaving(true);
      const response = await api.put('/profile', { name: editName.trim() });
      
      setProfile(prev => ({ ...prev, name: editName.trim() }));
      setEditing(false);
      showAlert('success', response.data.message || 'Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      showAlert('error', err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditName(profile?.name || '');
    setEditing(false);
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await api.delete('/profile');
      showAlert('success', 'Account deleted successfully. Redirecting...');
      
      // Redirect to logout after a short delay
      setTimeout(() => {
        window.location.href = 'http://localhost:8080/auth/logout';
      }, 2000);
    } catch (err) {
      console.error('Error deleting account:', err);
      showAlert('error', err.response?.data?.message || 'Failed to delete account');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <FaUser className="error-icon" />
          <h3>Error Loading Profile</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchProfile}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <FaUser className="error-icon" />
          <h3>No Profile Data</h3>
          <p>Unable to load profile information.</p>
          <button className="retry-btn" onClick={fetchProfile}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Alert Message */}
      {alert.show && (
        <div className={`alert alert-${alert.type}`}>
          <span className="alert-icon">
            {alert.type === 'success' ? '✓' : alert.type === 'error' ? '✗' : 'ℹ'}
          </span>
          <span className="alert-message">{alert.message}</span>
          <button 
            className="alert-close" 
            onClick={() => setAlert({ show: false, type: '', message: '' })}
          >
            ×
          </button>
        </div>
      )}

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser className="avatar-icon" />
        </div>
        <div className="profile-title">
          <h1>{profile.name || 'User'}</h1>
          <p>Member since {formatDate(profile.createdAt)}</p>
        </div>
      </div>

      <div className="profile-content">
        {/* Personal Information Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Personal Information</h2>
            {!editing && (
              <button className="edit-btn" onClick={() => setEditing(true)}>
                <FaEdit /> Edit
              </button>
            )}
            {editing && (
              <div className="edit-actions">
                <button 
                  className="save-btn" 
                  onClick={handleUpdateProfile}
                  disabled={saving}
                >
                  <FaSave /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  className="cancel-btn" 
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-field">
            <label>
              <FaUser className="field-icon" />
              Display Name
            </label>
            {editing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your display name"
              />
            ) : (
              <div className="field-value">{profile.name || 'Not set'}</div>
            )}
          </div>

          <div className="profile-field">
            <label>
              <FaCalendarAlt className="field-icon" />
              Member Since
            </label>
            <div className="field-value">{formatDate(profile.createdAt)}</div>
          </div>
        </div>

        {/* Statistics Section */}
        {stats && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Account Statistics</h2>
              <FaChartBar className="field-icon" />
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <FaStickyNote className="stat-icon" />
                <h3>{stats.overview?.totalNotes || 0}</h3>
                <p>Total Notes</p>
              </div>
              <div className="stat-card">
                <FaTags className="stat-icon" />
                <h3>{stats.overview?.totalLabels || 0}</h3>
                <p>Total Labels</p>
              </div>
              <div className="stat-card">
                <FaThumbtack className="stat-icon" />
                <h3>{stats.overview?.pinnedNotes || 0}</h3>
                <p>Pinned Notes</p>
              </div>
              <div className="stat-card">
                <FaArchive className="stat-icon" />
                <h3>{stats.overview?.archivedNotes || 0}</h3>
                <p>Archived Notes</p>
              </div>
              <div className="stat-card">
                <FaChartBar className="stat-icon" />
                <h3>{stats.overview?.recentActivity || 0}</h3>
                <p>Recent Activity (7 days)</p>
              </div>
            </div>

            {/* Label Distribution */}
            {stats.labelStats && stats.labelStats.length > 0 && (
              <div className="profile-field">
                <label>
                  <FaTags className="field-icon" />
                  Label Distribution
                </label>
                <div className="field-value">
                  {stats.labelStats.map(label => (
                    <div key={label.id} className="label-item">
                      <span>{label.name}</span>
                      <span className="label-count">
                        {label.notesCount} notes
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Danger Zone Section */}
        <div className="profile-section danger-zone">
          <div className="section-header">
            <h2 style={{ color: '#d32f2f' }}>Danger Zone</h2>
          </div>
          
          <div className="profile-field">
            <label style={{ color: '#d32f2f' }}>
              <FaTrash className="field-icon" />
              Delete Account
            </label>
            <div className="field-value">
              Permanently delete your account and all associated data (notes, labels). This action cannot be undone.
            </div>
            
            {!showDeleteConfirm ? (
              <button 
                className="cancel-btn" 
                onClick={() => setShowDeleteConfirm(true)}
                style={{ background: 'linear-gradient(135deg, #f44336, #d32f2f)' }}
              >
                <FaTrash /> Delete Account
              </button>
            ) : (
              <div className="delete-confirmation">
                <p>
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <div className="edit-actions">
                  <button 
                    className="cancel-btn" 
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    style={{ background: 'linear-gradient(135deg, #9e9e9e, #757575)' }}
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button 
                    className="cancel-btn" 
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    style={{ background: 'linear-gradient(135deg, #f44336, #d32f2f)' }}
                  >
                    <FaTrash /> {deleting ? 'Deleting...' : 'Yes, Delete Account'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
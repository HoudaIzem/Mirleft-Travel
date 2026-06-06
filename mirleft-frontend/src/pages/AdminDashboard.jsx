import { useEffect, useState } from 'react'
import {
  activityService,
  adminService,
  destinationService,
  propertyService,
  restaurantService,
  reviewService,
} from '../services/services'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const COLORS = {
  sand: '#f5ece0',
  gold: '#113611',
  goldDark: '#123b1e',
  brown: '#153526',
  brownLight: 'rgba(34, 128, 75, 0.4)',
  brownFaint: 'rgba(35, 126, 59, 0.3)',
  cream: '#fdf3e3',
  taupe: '#152d23',
  goldBorder: 'rgba(12, 62, 25, 0.4)',
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [destinations, setDestinations] = useState([])
  const [properties, setProperties] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [activities, setActivities] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [destinationForm, setDestinationForm] = useState({
    name: '',
    short_intro: '',
    overview: '',
    region: '',
    type: '',
    category: '',
    location: '',
    featured: false,
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }

    const load = async () => {
      try {
        const [statsRes, usersRes, reviewsRes] = await Promise.all([
          adminService.dashboard(),
          adminService.users(),
          adminService.reviews(),
        ])
        setStats(statsRes.data)
        setUsers(usersRes.data.data || [])
        setReviews(reviewsRes.data.data || [])
        const [destinationRes, propertyRes, restaurantRes, activityRes] = await Promise.all([
          destinationService.getAll({ per_page: 100 }),
          propertyService.getAll({ per_page: 100 }),
          restaurantService.getAll({ per_page: 100 }),
          activityService.getAll({ per_page: 100 }),
        ])
        setDestinations(destinationRes.data.data || [])
        setProperties(propertyRes.data.data || [])
        setRestaurants(restaurantRes.data.data || [])
        setActivities(activityRes.data.data || [])
      } catch (error) {
        console.error('Admin load failed:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAdmin])

  const changeRole = async (id, role) => {
    await adminService.updateUser(id, { role })
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
  }

  const banToggle = async (id, currentlyBanned) => {
    if (currentlyBanned) await adminService.unbanUser(id)
    else await adminService.banUser(id)
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, banned_at: currentlyBanned ? null : new Date().toISOString() } : u)))
  }

  const deleteReview = async (id) => {
    await reviewService.delete(id)
    setReviews((prev) => prev.filter((review) => review.id !== id))
  }

  const moderateReview = async (id, status) => {
    await adminService.moderateReview(id, status)
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const createDestination = async (e) => {
    e.preventDefault()
    const response = await destinationService.create(destinationForm)
    setDestinations((prev) => [response.data.data, ...prev])
    setDestinationForm({
      name: '',
      short_intro: '',
      overview: '',
      region: '',
      type: '',
      category: '',
      location: '',
      featured: false,
    })
  }

  const deleteDestination = async (id) => {
    await destinationService.delete(id)
    setDestinations((prev) => prev.filter((destination) => destination.id !== id))
  }

  const deleteProperty = async (id) => {
    await propertyService.delete(id)
    setProperties((prev) => prev.filter((item) => item.id !== id))
  }
  const deleteRestaurant = async (id) => {
    await restaurantService.delete(id)
    setRestaurants((prev) => prev.filter((item) => item.id !== id))
  }
  const deleteActivity = async (id) => {
    await activityService.delete(id)
    setActivities((prev) => prev.filter((item) => item.id !== id))
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: COLORS.sand, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: "'Jost', sans-serif"
      }}>
        <p style={{ fontSize: 18, color: COLORS.brownLight }}>Loading admin dashboard...</p>
      </div>
    )
  }
  
  if (!isAdmin) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: COLORS.sand, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: "'Jost', sans-serif"
      }}>
        <p style={{ fontSize: 18, color: COLORS.brownLight }}>Admin access required.</p>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: COLORS.sand, 
      fontFamily: "'Jost', sans-serif",
      padding: '2rem'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Jost:wght@300;400;500&display=swap');
        .ml-tab-btn { transition: all 0.2s; }
        .ml-tab-btn:hover { color: ${COLORS.gold}; }
        .ml-field-inner { transition: border-color 0.2s; }
        .ml-field-inner:focus-within { border-bottom-color: ${COLORS.gold} !important; }
        .ml-btn:hover { background: ${COLORS.goldDark} !important; }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.brown} 100%)`, 
          padding: '2rem 3rem', 
          borderRadius: 16, 
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative' }}>
            <h1 style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: 36, 
              fontWeight: 600, 
              color: COLORS.cream,
              margin: 0,
              marginBottom: '0.5rem'
            }}>
              Admin Dashboard
            </h1>
            <p style={{ fontSize: 14, color: COLORS.sand, margin: 0, opacity: 0.9 }}>
              Manage your Mirleft Travel platform
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'destinations', label: 'Destinations', icon: '📍' },
            { id: 'hotels', label: 'Hotels', icon: '🏨' },
            { id: 'restaurants', label: 'Restaurants', icon: '🍴' },
            { id: 'activities', label: 'Activities', icon: '🎯' },
            { id: 'users', label: 'Users', icon: '👥' },
            { id: 'reviews', label: 'Reviews', icon: '⭐' }
          ].map((tab) => (
            <button
              key={tab.id}
              className="ml-tab-btn"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                fontSize: 12,
                fontFamily: "'Jost', sans-serif",
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: activeTab === tab.id ? COLORS.cream : COLORS.brown,
                background: activeTab === tab.id ? COLORS.gold : COLORS.cream,
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {Object.entries(stats || {}).map(([key, value]) => (
              <div key={key} style={{
                background: COLORS.cream,
                borderRadius: 12,
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(61,42,15,0.08)'
              }}>
                <p style={{ 
                  fontSize: 11, 
                  color: COLORS.brownLight, 
                  margin: 0, 
                  marginBottom: '0.5rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  {key}
                </p>
                <p style={{ 
                  fontSize: 32, 
                  fontWeight: 600, 
                  color: COLORS.gold, 
                  margin: 0,
                  fontFamily: "'Cormorant Garamond', serif"
                }}>
                  {Array.isArray(value) ? value.length : typeof value === 'object' ? '--' : value}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'destinations' && (
          <div>
            <div style={{ 
              background: COLORS.cream, 
              borderRadius: 12, 
              padding: '2rem', 
              marginBottom: '2rem',
              boxShadow: '0 4px 15px rgba(61,42,15,0.08)'
            }}>
              <h2 style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontSize: 24, 
                fontWeight: 600, 
                color: COLORS.brown,
                margin: 0,
                marginBottom: '1.5rem'
              }}>
                Create New Destination
              </h2>
              <form onSubmit={createDestination} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <AdminField
                  label="Name"
                  value={destinationForm.name}
                  onChange={(v) => setDestinationForm({ ...destinationForm, name: v })}
                  required
                />
                <AdminField
                  label="Location"
                  value={destinationForm.location}
                  onChange={(v) => setDestinationForm({ ...destinationForm, location: v })}
                />
                <AdminField
                  label="Region"
                  value={destinationForm.region}
                  onChange={(v) => setDestinationForm({ ...destinationForm, region: v })}
                />
                <AdminField
                  label="Type"
                  value={destinationForm.type}
                  onChange={(v) => setDestinationForm({ ...destinationForm, type: v })}
                />
                <AdminField
                  label="Category"
                  value={destinationForm.category}
                  onChange={(v) => setDestinationForm({ ...destinationForm, category: v })}
                />
                <AdminField
                  label="Short Intro"
                  value={destinationForm.short_intro}
                  onChange={(v) => setDestinationForm({ ...destinationForm, short_intro: v })}
                />
                <AdminField
                  label="Overview"
                  value={destinationForm.overview}
                  onChange={(v) => setDestinationForm({ ...destinationForm, overview: v })}
                  isTextarea
                  style={{ gridColumn: '1 / -1' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={destinationForm.featured}
                    onChange={(e) => setDestinationForm({ ...destinationForm, featured: e.target.checked })}
                    id="featured"
                  />
                  <label htmlFor="featured" style={{ fontSize: 14, color: COLORS.brown }}>Featured</label>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button
                    type="submit"
                    className="ml-btn"
                    style={{
                      padding: '12px 32px',
                      background: COLORS.gold,
                      color: COLORS.cream,
                      border: 'none',
                      borderRadius: 4,
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    Create Destination
                  </button>
                </div>
              </form>
            </div>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {destinations.map((destination) => (
                <div key={destination.id} style={{
                  background: COLORS.cream,
                  borderRadius: 12,
                  padding: '1.5rem',
                  boxShadow: '0 2px 10px rgba(61,42,15,0.08)'
                }}>
                  <h3 style={{ 
                    fontFamily: "'Cormorant Garamond', serif", 
                    fontSize: 20, 
                    fontWeight: 600, 
                    color: COLORS.brown,
                    margin: 0,
                    marginBottom: '0.5rem'
                  }}>
                    {destination.name}
                  </h3>
                  <p style={{ fontSize: 13, color: COLORS.brownLight, margin: 0, marginBottom: '1rem' }}>
                    {destination.location}
                  </p>
                  <button
                    onClick={() => deleteDestination(destination.id)}
                    className="ml-btn"
                    style={{
                      padding: '8px 16px',
                      background: '#c0392b',
                      color: COLORS.cream,
                      border: 'none',
                      borderRadius: 4,
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hotels' && (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {properties.map((item) => (
              <div key={item.id} style={{
                background: COLORS.cream,
                borderRadius: 12,
                padding: '1.5rem',
                boxShadow: '0 2px 10px rgba(61,42,15,0.08)'
              }}>
                <h3 style={{ 
                  fontFamily: "'Cormorant Garamond', serif", 
                  fontSize: 20, 
                  fontWeight: 600, 
                  color: COLORS.brown,
                  margin: 0,
                  marginBottom: '0.5rem'
                }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: 13, color: COLORS.brownLight, margin: 0, marginBottom: '1rem' }}>
                  {item.location}
                </p>
                <button
                  onClick={() => deleteProperty(item.id)}
                  className="ml-btn"
                  style={{
                    padding: '8px 16px',
                    background: '#c0392b',
                    color: COLORS.cream,
                    border: 'none',
                    borderRadius: 4,
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {restaurants.map((item) => (
              <div key={item.id} style={{
                background: COLORS.cream,
                borderRadius: 12,
                padding: '1.5rem',
                boxShadow: '0 2px 10px rgba(61,42,15,0.08)'
              }}>
                <h3 style={{ 
                  fontFamily: "'Cormorant Garamond', serif", 
                  fontSize: 20, 
                  fontWeight: 600, 
                  color: COLORS.brown,
                  margin: 0,
                  marginBottom: '0.5rem'
                }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: 13, color: COLORS.brownLight, margin: 0, marginBottom: '1rem' }}>
                  {item.location}
                </p>
                <button
                  onClick={() => deleteRestaurant(item.id)}
                  className="ml-btn"
                  style={{
                    padding: '8px 16px',
                    background: '#c0392b',
                    color: COLORS.cream,
                    border: 'none',
                    borderRadius: 4,
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'activities' && (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {activities.map((item) => (
              <div key={item.id} style={{
                background: COLORS.cream,
                borderRadius: 12,
                padding: '1.5rem',
                boxShadow: '0 2px 10px rgba(61,42,15,0.08)'
              }}>
                <h3 style={{ 
                  fontFamily: "'Cormorant Garamond', serif", 
                  fontSize: 20, 
                  fontWeight: 600, 
                  color: COLORS.brown,
                  margin: 0,
                  marginBottom: '0.5rem'
                }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 13, color: COLORS.brownLight, margin: 0, marginBottom: '1rem' }}>
                  {item.location}
                </p>
                <button
                  onClick={() => deleteActivity(item.id)}
                  className="ml-btn"
                  style={{
                    padding: '8px 16px',
                    background: '#c0392b',
                    color: COLORS.cream,
                    border: 'none',
                    borderRadius: 4,
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{
            background: COLORS.cream,
            borderRadius: 12,
            padding: '2rem',
            boxShadow: '0 4px 15px rgba(61,42,15,0.08)',
            overflowX: 'auto'
          }}>
            <h2 style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: 24, 
              fontWeight: 600, 
              color: COLORS.brown,
              margin: 0,
              marginBottom: '1.5rem'
            }}>
              Manage Users
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: COLORS.brownFaint }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: 12, color: COLORS.brown, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: 12, color: COLORS.brown, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: 12, color: COLORS.brown, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Role</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: 12, color: COLORS.brown, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Ban</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${COLORS.brownFaint}` }}>
                    <td style={{ padding: '1rem', fontSize: 14, color: COLORS.brown }}>{u.name}</td>
                    <td style={{ padding: '1rem', fontSize: 14, color: COLORS.brown }}>{u.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        style={{
                          padding: '8px 12px',
                          border: `1px solid ${COLORS.brownLight}`,
                          borderRadius: 4,
                          background: COLORS.cream,
                          fontFamily: "'Jost', sans-serif",
                          fontSize: 13,
                          color: COLORS.brown
                        }}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => banToggle(u.id, !!u.banned_at)}
                        className="ml-btn"
                        style={{
                          padding: '8px 16px',
                          background: !!u.banned_at ? '#27ae60' : '#c0392b',
                          color: COLORS.cream,
                          border: 'none',
                          borderRadius: 4,
                          fontFamily: "'Jost', sans-serif",
                          fontSize: 11,
                          fontWeight: 500,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          cursor: 'pointer'
                        }}
                      >
                        {!!u.banned_at ? 'Unban' : 'Ban'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {reviews.map((review) => (
              <div key={review.id} style={{
                background: COLORS.cream,
                borderRadius: 12,
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(61,42,15,0.08)'
              }}>
                <h3 style={{ 
                  fontFamily: "'Cormorant Garamond', serif", 
                  fontSize: 20, 
                  fontWeight: 600, 
                  color: COLORS.brown,
                  margin: 0,
                  marginBottom: '0.5rem'
                }}>
                  {review.title || 'Untitled review'}
                </h3>
                <p style={{ fontSize: 13, color: COLORS.brownLight, margin: 0, marginBottom: '1rem' }}>
                  By {review.user?.name || 'Unknown'} - {review.rating}/5 - {review.status || 'pending'}
                </p>
                <p style={{ fontSize: 14, color: COLORS.brown, margin: 0, marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  {review.text}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => moderateReview(review.id, 'approved')}
                    className="ml-btn"
                    style={{
                      padding: '10px 20px',
                      background: '#27ae60',
                      color: COLORS.cream,
                      border: 'none',
                      borderRadius: 4,
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => moderateReview(review.id, 'rejected')}
                    className="ml-btn"
                    style={{
                      padding: '10px 20px',
                      background: '#f39c12',
                      color: COLORS.cream,
                      border: 'none',
                      borderRadius: 4,
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="ml-btn"
                    style={{
                      padding: '10px 20px',
                      background: '#c0392b',
                      color: COLORS.cream,
                      border: 'none',
                      borderRadius: 4,
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    Delete Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AdminField({ label, value, onChange, isTextarea, style, required }) {
  return (
    <div style={{ ...style }}>
      <label style={{ 
        display: 'block', 
        fontSize: 11, 
        fontWeight: 500, 
        color: COLORS.brown, 
        letterSpacing: '0.1em', 
        textTransform: 'uppercase',
        marginBottom: '0.5rem'
      }}>
        {label}
      </label>
      <div
        className="ml-field-inner"
        style={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${COLORS.brownLight}`, padding: '8px 0' }}
      >
        {isTextarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            required={required}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              outline: 'none',
              fontFamily: "'Jost', sans-serif",
              fontSize: 14,
              fontWeight: 300,
              color: COLORS.brown,
              letterSpacing: '0.02em',
              resize: 'vertical'
            }}
          />
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              outline: 'none',
              fontFamily: "'Jost', sans-serif",
              fontSize: 14,
              fontWeight: 300,
              color: COLORS.brown,
              letterSpacing: '0.02em'
            }}
          />
        )}
      </div>
    </div>
  )
}

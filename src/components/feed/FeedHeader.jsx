import { useState } from 'react'
import { displayName } from './feedUtils'

function SearchIcon() {
  return (
    <svg className="_header_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17" aria-hidden="true">
      <circle cx="7" cy="7" r="6" stroke="#666" />
      <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" fill="none" viewBox="0 0 18 21" aria-hidden="true">
      <path className="_home_active" stroke="#000" strokeWidth="1.5" strokeOpacity=".6" d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z" />
      <path className="_home_active" stroke="#000" strokeOpacity=".6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.857 19.341v-5.857a1 1 0 0 0-1-1H7.143a1 1 0 0 0-1 1v5.857" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="20" fill="none" viewBox="0 0 26 20" aria-hidden="true">
      <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M12.79 12.15h.429c2.268.015 7.45.243 7.45 3.732 0 3.466-5.002 3.692-7.415 3.707h-.894c-2.268-.015-7.452-.243-7.452-3.727 0-3.47 5.184-3.697 7.452-3.711l.297-.001h.132zm0 1.75c-2.792 0-6.12.34-6.12 1.962 0 1.585 3.13 1.955 5.864 1.976l.255.002c2.792 0 6.118-.34 6.118-1.958 0-1.638-3.326-1.982-6.118-1.982zM12.789 0c2.96 0 5.368 2.392 5.368 5.33 0 2.94-2.407 5.331-5.368 5.331h-.031a5.329 5.329 0 0 1-3.782-1.57 5.253 5.253 0 0 1-1.553-3.764C7.423 2.392 9.83 0 12.789 0zm0 1.75c-1.987 0-3.604 1.607-3.604 3.58a3.526 3.526 0 0 0 1.04 2.527 3.58 3.58 0 0 0 2.535 1.054l.03.875v-.875c1.987 0 3.605-1.605 3.605-3.58S14.777 1.75 12.789 1.75z" clipRule="evenodd" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22" aria-hidden="true">
      <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 0 1 1.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 0 1 .057-1.083.774.774 0 0 1 1.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299.459-.758.898-1.484.898-3.188C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd" />
    </svg>
  )
}

function MessageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M12.002 0c3.208 0 6.223 1.239 8.487 3.489 4.681 4.648 4.681 12.211 0 16.86-2.294 2.28-5.384 3.486-8.514 3.486-1.706 0-3.423-.358-5.03-1.097-.474-.188-.917-.366-1.235-.366-.366.003-.859.171-1.335.334-.976.333-2.19.748-3.09-.142-.895-.89-.482-2.093-.149-3.061.164-.477.333-.97.333-1.342 0-.306-.149-.697-.376-1.259C-1 12.417-.032 7.011 3.516 3.49A11.96 11.96 0 0 1 12.002 0zm4.408 11.27c.617 0 1.117.495 1.117 1.109 0 .613-.5 1.109-1.117 1.109a1.116 1.116 0 0 1-1.12-1.11c0-.613.494-1.108 1.11-1.108h.01zm-4.476 0c.616 0 1.117.495 1.117 1.109 0 .613-.5 1.109-1.117 1.109a1.116 1.116 0 0 1-1.121-1.11c0-.613.493-1.108 1.11-1.108h.01zm-4.477 0c.617 0 1.117.495 1.117 1.109 0 .613-.5 1.109-1.117 1.109a1.116 1.116 0 0 1-1.12-1.11c0-.613.494-1.108 1.11-1.108h.01z" clipRule="evenodd" />
    </svg>
  )
}

export default function FeedHeader({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const name = displayName(user) || 'Profile'

  return (
    <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
      <div className="container _custom_container feed-header-react">
        <a className="navbar-brand _logo_wrap" href="/feed" aria-label="BuddyScript home">
          <img src="/assets/images/logo.svg" alt="BuddyScript" className="_nav_logo" />
        </a>
        <div className="_header_form ms-auto">
          <form className="_header_form_grp" role="search">
            <SearchIcon />
            <input className="form-control me-2 _inpt1" type="search" placeholder="input search text" aria-label="Search" />
          </form>
        </div>
        <ul className="navbar-nav mb-2 mb-lg-0 _header_nav_list ms-auto _mar_r8">
          <li className="nav-item _header_nav_item"><button className="nav-link _header_nav_link_active _header_nav_link" type="button" aria-label="Home"><HomeIcon /></button></li>
          <li className="nav-item _header_nav_item"><button className="nav-link _header_nav_link" type="button" aria-label="Friends"><PeopleIcon /></button></li>
          <li className="nav-item _header_nav_item"><button className="nav-link _header_nav_link _header_notify_btn" type="button" aria-label="Notifications"><BellIcon /><span className="_counting">6</span></button></li>
          <li className="nav-item _header_nav_item"><button className="nav-link _header_nav_link" type="button" aria-label="Messages"><MessageIcon /><span className="_counting">2</span></button></li>
        </ul>
        <div className="_header_nav_right">
          <div className="_header_nav_profile">
            <button className="_header_nav_profile_link feed-profile-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen}>
              <img src="/assets/images/people3.png" alt="" className="_header_nav_profile_img" />
              <span className="_header_nav_para">{name}</span>
            </button>
            {menuOpen ? (
              <div className="_nav_profile_dropdown show feed-profile-dropdown">
                <button className="_nav_dropdown_link" type="button" onClick={onLogout}>Logout</button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}

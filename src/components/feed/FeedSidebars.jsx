const people = [
  { name: 'Steve Jobs', role: 'CEO of Apple', image: '/assets/images/people1.png' },
  { name: 'Ryan Roslansky', role: 'CEO of Linkedin', image: '/assets/images/people2.png' },
  { name: 'Dylan Field', role: 'CEO of Figma', image: '/assets/images/people3.png' },
]

const explore = [
  ['Learning', 'play', true],
  ['Insights', 'chart'],
  ['Find friends', 'user'],
  ['Bookmarks', 'bookmark'],
  ['Group', 'users'],
  ['Gaming', 'game', true],
  ['Settings', 'settings'],
  ['Save post', 'save'],
]

function MiniIcon({ type }) {
  const common = { width: 22, height: 22, fill: 'none', viewBox: '0 0 24 24', 'aria-hidden': true }
  const stroke = { stroke: '#666', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

  if (type === 'chart') return <svg {...common}><path {...stroke} d="M4 19V5M10 19V9M16 19v-6M22 19H2" /></svg>
  if (type === 'user') return <svg {...common}><path {...stroke} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle {...stroke} cx="9" cy="7" r="4" /><path {...stroke} d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  if (type === 'bookmark') return <svg {...common}><path {...stroke} d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
  if (type === 'users') return <svg {...common}><path {...stroke} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle {...stroke} cx="9" cy="7" r="4" /><path {...stroke} d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  if (type === 'game') return <svg {...common}><path {...stroke} d="M6 12h4M8 10v4M15 13h.01M18 11h.01" /><path {...stroke} d="M17.32 5H6.68A4 4 0 0 0 2.8 8.03l-1.2 4.8A3 3 0 0 0 4.5 16.56 3.2 3.2 0 0 0 7 15.36L8 14h8l1 1.36a3.2 3.2 0 0 0 2.5 1.2 3 3 0 0 0 2.9-3.73l-1.2-4.8A4 4 0 0 0 17.32 5z" /></svg>
  if (type === 'settings') return <svg {...common}><circle {...stroke} cx="12" cy="12" r="3" /><path {...stroke} d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8.92 4a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 15 3.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.31.39.57.7.71.24.11.5.17.77.17H21a2 2 0 0 1 0 4h-.09A1.65 1.65 0 0 0 19.4 15z" /></svg>
  if (type === 'save') return <svg {...common}><path {...stroke} d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path {...stroke} d="M17 21v-8H7v8M7 3v5h8" /></svg>
  return <svg {...common}><circle {...stroke} cx="12" cy="12" r="10" /><path {...stroke} d="M10 8l6 4-6 4z" /></svg>
}

function Section({ children, className = '' }) {
  return <div className={`${className} _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area`}>{children}</div>
}

export function FeedLeftSidebar() {
  return (
    <aside className="_layout_left_sidebar_wrap">
      <div className="_layout_left_sidebar_inner">
        <Section className="_left_inner_area_explore">
          <h4 className="_left_inner_area_explore_title _title5 _mar_b24">Explore</h4>
          <ul className="_left_inner_area_explore_list">
            {explore.map(([label, icon, isNew]) => (
              <li className={`_left_inner_area_explore_item${isNew ? ' _explore_item' : ''}`} key={label}>
                <a href="#0" className="_left_inner_area_explore_link" onClick={(event) => event.preventDefault()}>
                  <MiniIcon type={icon} />
                  {label}
                </a>
                {isNew ? <span className="_left_inner_area_explore_link_txt">New</span> : null}
              </li>
            ))}
          </ul>
        </Section>
      </div>
      <div className="_layout_left_sidebar_inner">
        <Section className="_left_inner_area_suggest">
          <div className="_left_inner_area_suggest_content _mar_b24">
            <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
            <span className="_left_inner_area_suggest_content_txt"><a className="_left_inner_area_suggest_content_txt_link" href="#0" onClick={(event) => event.preventDefault()}>See All</a></span>
          </div>
          {people.map((person, index) => (
            <div className="_left_inner_area_suggest_info" key={person.name}>
              <div className="_left_inner_area_suggest_info_box">
                <div className="_left_inner_area_suggest_info_image"><img src={person.image} alt="" className={index === 0 ? '_info_img' : '_info_img1'} /></div>
                <div className="_left_inner_area_suggest_info_txt">
                  <h4 className="_left_inner_area_suggest_info_title">{person.name}</h4>
                  <p className="_left_inner_area_suggest_info_para">{person.role}</p>
                </div>
              </div>
              <div className="_left_inner_area_suggest_info_link"><button type="button" className="_info_link">Connect</button></div>
            </div>
          ))}
        </Section>
      </div>
      <div className="_layout_left_sidebar_inner">
        <Section className="_left_inner_area_event">
          <div className="_left_inner_event_content">
            <h4 className="_left_inner_event_title _title5">Events</h4>
            <a href="#0" className="_left_inner_event_link" onClick={(event) => event.preventDefault()}>See all</a>
          </div>
          <div className="_left_inner_event_card">
            <div className="_left_inner_event_card_iamge"><img src="/assets/images/feed_event1.png" alt="" className="_card_img" /></div>
            <div className="_left_inner_event_card_content">
              <div className="_left_inner_card_date"><p className="_left_inner_card_date_para">10</p><p className="_left_inner_card_date_para1">Jul</p></div>
              <div className="_left_inner_card_txt"><h4 className="_left_inner_event_card_title">No more terrorism no more cry</h4></div>
            </div>
            <hr className="_underline" />
            <div className="_left_inner_event_bottom"><p className="_left_iner_event_bottom">17 People Going</p><button type="button" className="_left_iner_event_bottom_link">Going</button></div>
          </div>
        </Section>
      </div>
    </aside>
  )
}

export function FeedRightSidebar() {
  return (
    <aside className="_layout_right_sidebar_wrap">
      <div className="_layout_right_sidebar_inner">
        <div className="_right_inner_area_info _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_right_inner_area_info_content _mar_b24">
            <h4 className="_right_inner_area_info_content_title _title5">You Might Like</h4>
            <span className="_right_inner_area_info_content_txt"><a className="_right_inner_area_info_content_txt_link" href="#0" onClick={(event) => event.preventDefault()}>See All</a></span>
          </div>
          <hr className="_underline" />
          <div className="_right_inner_area_info_ppl">
            <div className="_right_inner_area_info_box">
              <div className="_right_inner_area_info_box_image"><img src="/assets/images/Avatar.png" alt="" className="_ppl_img" /></div>
              <div className="_right_inner_area_info_box_txt"><h4 className="_right_inner_area_info_box_title">Radovan SkillArena</h4><p className="_right_inner_area_info_box_para">Founder &amp; CEO at Trophy</p></div>
            </div>
            <div className="_right_info_btn_grp"><button type="button" className="_right_info_btn_link">Ignore</button><button type="button" className="_right_info_btn_link _right_info_btn_link_active">Follow</button></div>
          </div>
        </div>
      </div>
      <div className="_layout_right_sidebar_inner">
        <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_feed_top_fixed">
            <div className="_feed_right_inner_area_card_content _mar_b24">
              <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
              <span className="_feed_right_inner_area_card_content_txt"><a className="_feed_right_inner_area_card_content_txt_link" href="#0" onClick={(event) => event.preventDefault()}>See All</a></span>
            </div>
            <form className="_feed_right_inner_area_card_form" role="search">
              <span className="feed-sidebar-search-icon" aria-hidden="true">/</span>
              <input className="form-control me-2 _feed_right_inner_area_card_form_inpt" type="search" placeholder="input search text" aria-label="Find friends" />
            </form>
          </div>
          <div className="_feed_bottom_fixed">
            {people.concat(people).map((person, index) => (
              <div className={`_feed_right_inner_area_card_ppl${index === 0 || index === 3 ? ' _feed_right_inner_area_card_ppl_inactive' : ''}`} key={`${person.name}-${index}`}>
                <div className="_feed_right_inner_area_card_ppl_box">
                  <div className="_feed_right_inner_area_card_ppl_image"><img src={person.image} alt="" className="_box_ppl_img" /></div>
                  <div className="_feed_right_inner_area_card_ppl_txt"><h4 className="_feed_right_inner_area_card_ppl_title">{person.name}</h4><p className="_feed_right_inner_area_card_ppl_para">{person.role}</p></div>
                </div>
                <div className="_feed_right_inner_area_card_ppl_side">{index === 0 || index === 3 ? <span>5 minute ago</span> : <span className="feed-online-dot" aria-label="Online" />}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

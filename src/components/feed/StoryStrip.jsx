const stories = [
  { image: '/assets/images/card_ppl1.png', title: 'Your Story', mine: true },
  { image: '/assets/images/card_ppl2.png', title: 'Ryan Roslansky' },
  { image: '/assets/images/card_ppl3.png', title: 'Ryan Roslansky' },
  { image: '/assets/images/card_ppl4.png', title: 'Ryan Roslansky' },
]

export default function StoryStrip() {
  return (
    <div className="_feed_inner_ppl_card _mar_b16" aria-label="Stories">
      <div className="_feed_inner_story_arrow">
        <button type="button" className="_feed_inner_story_arrow_btn" aria-label="Next stories">
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8" aria-hidden="true">
            <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 0 1 0-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
          </svg>
        </button>
      </div>
      <div className="row feed-story-row">
        {stories.map((story) => (
          <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col" key={story.title + story.image}>
            <div className={story.mine ? '_feed_inner_profile_story _b_radious6' : '_feed_inner_public_story _b_radious6'}>
              <div className={story.mine ? '_feed_inner_profile_story_image' : '_feed_inner_public_story_image'}>
                <img src={story.image} alt="" className={story.mine ? '_story_img' : '_public_story_img'} />
              </div>
              {story.mine ? (
                <button type="button" className="_feed_inner_profile_story_btn" aria-label="Add a story">+</button>
              ) : (
                <div className="_feed_inner_public_mini"><img src="/assets/images/mini_pic.png" alt="" className="_public_mini_img" /></div>
              )}
              <div className={story.mine ? '_feed_inner_profile_story_txt' : '_feed_inner_pulic_story_txt'}>
                <p className={story.mine ? '_feed_inner_profile_story_para' : '_feed_inner_pulic_story_para'}>{story.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

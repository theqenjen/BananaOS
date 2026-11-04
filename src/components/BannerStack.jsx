import { useOS } from '../os/OSProvider'
import { APPS } from '../os/appRegistry'
import { AppIcon } from './AppIcon'

export function BannerStack() {
  const { ui, actions } = useOS()
  if (!ui.banners.length) return null

  return (
    <div className="banners">
      {ui.banners.map((banner) => {
        const app = APPS[banner.appId] || APPS.messages
        return (
          <button
            type="button"
            key={banner.id}
            className="banner"
            onClick={() => {
              actions.dismissBanner(banner.id)
              if (banner.appId) actions.openApp(banner.appId)
            }}
          >
            <AppIcon app={app} size={34} plain />
            <span className="banner-text">
              <strong>{banner.title}</strong>
              <span>{banner.body}</span>
            </span>
            <span className="banner-app">{app.name}</span>
          </button>
        )
      })}
    </div>
  )
}

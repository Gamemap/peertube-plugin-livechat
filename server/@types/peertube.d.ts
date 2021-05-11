interface RegisterServerHookOptions {
  target: string // FIXME
  handler: Function
  priority?: number
}

interface RegisterServerSettingOptions {
  name: string
  label: string
  type: 'input' | 'input-checkbox' | 'input-password' | 'input-textarea' | 'markdown-text' | 'markdown-enhanced'
  descriptionHTML?: string
  default?: string | boolean
  private: boolean
}

interface PluginSettingsManager {
  getSetting: (name: string) => Promise<string | boolean>
  getSettings: (names: string[]) => Promise<{ [settingName: string]: string | boolean }>
  setSetting: (name: string, value: string) => Promise<any>
  onSettingsChange: (cb: (names: string[]) => void) => void
}

interface PluginStorageManager {
  getData: (key: string) => Promise<string>
  storeData: (key: string, data: any) => Promise<any>
}

interface PluginVideoCategoryManager {
  addCategory: (categoryKey: number, categoryLabel: string) => boolean
  deleteCategory: (categoryKey: number) => boolean
}

interface PluginVideoLicenceManager {
  addLicence: (licenceKey: number, licenceLabel: string) => boolean
  deleteLicence: (licenceKey: number) => boolean
}

interface PluginVideoLanguageManager {
  addLanguage: (languageKey: string, languageLabel: string) => boolean
  deleteLanguage: (languageKey: string) => boolean
}

enum VideoPrivacy {
  PUBLIC = 1,
  UNLISTED = 2,
  PRIVATE = 3,
  INTERNAL = 4
}

enum VideoState {
  PUBLISHED = 1,
  TO_TRANSCODE = 2,
  TO_IMPORT = 3,
  WAITING_FOR_LIVE = 4,
  LIVE_ENDED = 5
}

interface MVideoThumbnail { // FIXME: this interface is not complete.
  uuid: string
  name: string
  category: number
  licence: number
  language: string
  privacy: VideoPrivacy
  nsfw: boolean
  description: string
  support: string
  duration: number
  videos: number
  likes: number
  dislikes: number
  remote: boolean
  isLive: boolean
  url: string
  commentsEnabled: boolean
  downloadEnabled: boolean
  state: VideoState
  channelId: number
}

// Keep the order
enum UserRole {
  ADMINISTRATOR = 0,
  MODERATOR = 1,
  USER = 2
}

interface MUserDefault { // FIXME: this interface is not complete
  id?: string | number // FIXME: type is not clear... Documentation says string, but it seems to be number
  username: string
  email: string
  blocked: boolean
  role: UserRole
  Account?: {
    // Account.name comes in Peertube 3.2.0
    name?: string
  }
}

interface VideoBlacklistCreate {
  reason?: string
  unfederate?: boolean
}

type ActorModel = any // FIXME

interface ServerConfig { // FIXME: this interface is not complete
  serverVersion: string
  serverCommit?: string

  instance: {
    name: string
    shortDescription: string
    isNSFW: boolean
    // defaultNSFWPolicy: NSFWPolicyType
    defaultClientRoute: string
    customizations: {
      javascript: string
      css: string
    }
  }
}

interface PeerTubeHelpers {
  logger: Logger
  database: {
    query: Function
  }
  videos: {
    loadByUrl: (url: string) => Promise<MVideoThumbnail>
    // NB: loadByIdOrUUID was introduced in v3.1.0
    loadByIdOrUUID: (id: number | string) => Promise<MVideoThumbnail>
    removeVideo: (videoId: number) => Promise<void>
  }
  config: {
    getWebserverUrl: () => string
    // getServerConfig comes with Peertube 3.2.0
    getServerConfig?: () => Promise<ServerConfig>
  }
  moderation: {
    blockServer: (options: { byAccountId: number, hostToBlock: string }) => Promise<void>
    unblockServer: (options: { byAccountId: number, hostToUnblock: string }) => Promise<void>
    blockAccount: (options: { byAccountId: number, handleToBlock: string }) => Promise<void>
    unblockAccount: (options: { byAccountId: number, handleToUnblock: string }) => Promise<void>
    blacklistVideo: (
      options: { videoIdOrUUID: number | string, createOptions: VideoBlacklistCreate }
    ) => Promise<void>
    unblacklistVideo: (options: { videoIdOrUUID: number | string }) => Promise<void>
  }
  server: {
    getServerActor: () => Promise<ActorModel>
  }
  // Added in Peertube 3.2.0
  user?: {
    getAuthUser: (res: express.Response) => Promise<MUserDefault | undefined>
  }
}

interface RegisterServerOptions {
  registerHook: (options: RegisterServerHookOptions) => void
  registerSetting: (options: RegisterServerSettingOptions) => void
  settingsManager: PluginSettingsManager
  storageManager: PluginStorageManager
  videoCategoryManager: PluginVideoCategoryManager
  videoLicenceManager: PluginVideoLicenceManager
  videoLanguageManager: PluginVideoLanguageManager
  getRouter: () => Router
  peertubeHelpers: PeerTubeHelpers
}

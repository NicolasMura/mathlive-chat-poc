/**
 * IBuildInfos interface and typings
 */
export interface IBuildInfos {
  hash?: string; // Latest commit hash
  timestamp?: string; // Timestamp on when the build was made
  user?: string; // Current git user
  version?: string; // `version` from package.json
  jenkinsBuildNumber?: number; // `version` from ${BUILD_ID} Jenkins variable
  message?: string; // Custom build message
}

import { createController } from '@/common/createController'
import { ProfileInput, ProfilePatchInput } from '@/domain/profile'
import { ProfileError } from '@/services/profile/etc/profile.error'
import { profileRepo } from '@/services/profile/profile.repo'
import { Controller } from '@/types/controllerRelated.types'
import { exists } from '@/utils/exists'
import { justLog } from '@/utils/justLog'
import { excludeKeys } from '@/utils/security/excludeKeys'

export const registerProfileController: Controller<
  ReturnType<typeof profileRepo>
> = createController({
  scope: 'profile',
  requireAuth: true,
  transport: ['ws', 'rest'],
  repository: profileRepo,
  register: (addListener, repository) => {
    addListener<ProfileInput>(
      {
        eventName: 'create',
        description: 'Create Profile with at least all needed params',
        requireAuth: true,
        validator: ProfileInput,
      },
      (resolve, reject, context) => async profileInput => {
        const profileExists = await repository.checkIfProfileExists(
          context.userId!,
        )
        if (profileExists)
          return reject({ reason: ProfileError.ProfileAlreadyExists })
        try {
          const createdProfile = await repository.createProfile(
            context.userId!,
            excludeKeys(profileInput, ['id', 'accountId']),
          )

          if (exists(createdProfile)) {
            return resolve(createdProfile)
          } else {
            return reject({ reason: ProfileError.UnableToCreateProfile })
          }
        } catch (e) {
          justLog.error(e)
          return reject({
            reason: ProfileError.UnableToCreateProfile,
            error: e,
          })
        }
      },
    )

    addListener<ProfilePatchInput>(
      {
        eventName: 'edit',
        description: 'Edit Profiles fields',
        requireAuth: true,
        restMethods: ['POST', 'PATCH'],
        validator: ProfilePatchInput,
      },
      (resolve, reject, context) => async profilePartialInput => {
        const profileExists = await repository.checkIfProfileExists(
          context.userId!,
        )
        if (!profileExists)
          return reject({ reason: ProfileError.NeedToCreateProfile })
        try {
          const patchedProfile = await repository.patchProfile(
            context.userId!,
            excludeKeys(profilePartialInput, ['id', 'accountId']),
          )

          if (exists(patchedProfile)) {
            return resolve(patchedProfile)
          } else {
            return reject({ reason: ProfileError.UnableToPatchProfile })
          }
        } catch (e) {
          justLog.error(e)
          return reject({ reason: ProfileError.UnableToPatchProfile, error: e })
        }
      },
    )

    addListener(
      {
        eventName: 'my',
        description: 'Get your full profile',
        requireAuth: true,
        restMethods: ['GET', 'POST'],
      },
      (resolve, reject, context) => async () => {
        const profile = await repository.getProfile(context.userId!)
        if (!exists(profile)) {
          return reject({ reason: ProfileError.NeedToCreateProfile })
        }

        if (exists(profile)) {
          return resolve(profile)
        } else {
          return reject({ reason: ProfileError.ProfileNotExists })
        }
      },
    )

    addListener(
      {
        eventName: 'getOverallStats',
        description: 'Get overall stats',
        requireAuth: true,
        restMethods: ['GET', 'POST'],
      },
      (resolve, reject, context) => async () => {
        const profile = await repository.getProfileWithAllExtras(
          context.userId!,
        )

        if (exists(profile)) {
          return resolve(profile)
        } else {
          return reject({ reason: ProfileError.ProfileNotExists })
        }
      },
    )

    /*addListener(
      {
        eventName: 'mock',
        description: 'Insert prepared 100 profiles',
        requireAuth: true,
        restMethods: ['GET', 'POST'],
      },
      (resolve, reject, context) => async () => {
        return resolve({ res: repository.mock() })
      },
    )*/
  },
})

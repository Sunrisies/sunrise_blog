import { SetMetadata } from '@nestjs/common'
import { Permission } from '../apps/user/entities/user.entity'

export const RequirePermissions = (...permissions: Permission[]) => {
  console.log('permissions--------', permissions)
  return SetMetadata('permissions', permissions)
}

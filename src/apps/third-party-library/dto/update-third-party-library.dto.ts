import { PartialType } from '@nestjs/swagger'
import { CreateThirdPartyLibraryDto } from './create-third-party-library.dto'

export class UpdateThirdPartyLibraryDto extends PartialType(CreateThirdPartyLibraryDto) {}

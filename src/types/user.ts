import { AnalyticsEvent, Block, } from "@/generated/prisma";

export interface BaseUser {
  id : string
  username? : string
  email? :  string
  displayName?  : string 
  avatarUrl? :  string
  theme? : JSON
}

export interface UserWithData extends BaseUser {
    links? : Block[]
    analytics? : AnalyticsEvent[]
}

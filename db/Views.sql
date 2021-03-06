use JusticePortal
go

if OBJECT_ID('vwUserRights') is not null
  drop view vwUserRights
go
--select * from vwUserRights
create view vwUserRights as
  select pu.PortalUserId, ur.*
  from PortalUser pu
  join PortalUser2Right pu2r on pu2r.PortalUserId = pu.PortalUserId
  join UserRight ur on ur.UserRightId = pu2r.UserRightId
  union 
  select pu.PortalUserId, ur.*
  from PortalUser pu
  join PortalUser2Group pu2g on pu2g.PortalUserId = pu.PortalUserId
  join PortalGroup2Right pg2r on pg2r.PortalGroupId = pu2g.PortalGroupId
  join UserRight ur on ur.UserRightId = pg2r.UserRightId
go

if OBJECT_ID('vwUserParts') is not null
  drop view vwUserParts
go
--select * from vwUserParts
create view vwUserParts as
  select pu.PortalUserId, pp.*
  from PortalUser pu
  join PortalUser2Part pu2p on pu2p.PortalUserId = pu.PortalUserId
  join PortalPart pp on pp.PortalPartId = pu2p.PortalPartId
  union 
  select pu.PortalUserId, pp.*
  from PortalUser pu
  join PortalUser2Group pu2g on pu2g.PortalUserId = pu.PortalUserId
  join PortalGroup2Part pg2p on pg2p.PortalGroupId = pu2g.PortalGroupId
  join PortalPart pp on pp.PortalPartId = pg2p.PortalPartId
go


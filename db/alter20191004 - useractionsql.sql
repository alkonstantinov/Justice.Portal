if OBJECT_ID('UserAction') is not null
begin
  exec p_ak_drop_all_foreign_keys 'UserAction'
  drop table UserAction
end
go

create table UserAction
(
  UserActionId int not null identity(1,1),
  PortalUserId int not null,
  OnTime datetime not null,
  Title nvarchar(max) not null,
  Content nvarchar(max),
  constraint pk_UserActionId primary key (UserActionId),
  constraint fk_UserAction_PortalUserId foreign key (PortalUserId) references PortalUser(PortalUserId) on delete cascade
)
go


exec p_ak_create_fk_indeces 'UserAction'
go

insert into [dbo].[UserRight] (UserRightId, Description)
values ('audit', N'Одит')

insert into [dbo].[PortalUser2Right](PortalUserId, UserRightId)
values(1, 'audit')
go

alter table Block
add IsActive bit not null default 1
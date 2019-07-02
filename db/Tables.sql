use JusticePortal
go

if OBJECT_ID('UserRight') is not null
begin
  exec p_ak_drop_all_foreign_keys 'UserRight'
  drop table UserRight
end
go

create table UserRight 
(
  UserRightId int not null,
  Name nvarchar(20) not null,
  Description nvarchar(50) not null,
  constraint pk_UserRightId primary key (UserRightId)
)
go

exec p_ak_create_fk_indeces 'UserRight'
create unique index idx_UserRight_Name on UserRight(Name)

insert into UserRight (UserRightId, Name, Description) values
(1,'adminusers', N'Администрация на потребители')

go

if OBJECT_ID('PortalPart') is not null
begin
  exec p_ak_drop_all_foreign_keys 'PortalPart'
  drop table PortalPart
end
go

create table PortalPart 
(
  PortalPartId int not null,
  Name nvarchar(50) not null,
  PartKey nvarchar(20) not null,
  constraint pk_PortalPartId primary key (PortalPartId)
)
go

exec p_ak_create_fk_indeces 'PortalPart'

create unique index idx_PortalPart_PartKey on PortalPart(PartKey)

insert into PortalPart (PortalPartId, Name, PartKey) values
(1, N'Министерство на правосъдието', 'min'),
(2, N'Агенция по вписванията', 'av'),
(3, N'Национално бюро за правна помощ', 'nbpp'),
(4, N'Централен регистър на особените залози', 'croz'),
(5, N'ГД "Изпълнение на наказанията"', 'gdin'),
(6, N'ГД "Охрана"', 'gdo')
go


if OBJECT_ID('PortalGroup') is not null
begin
  exec p_ak_drop_all_foreign_keys 'PortalGroup'
  drop table PortalGroup
end
go

create table PortalGroup 
(
  PortalGroupId int not null identity(1,1),
  Name nvarchar(100) not null,
  constraint pk_PortalGroupId primary key (PortalGroupId)
)
go

exec p_ak_create_fk_indeces 'PortalGroup'
go



if OBJECT_ID('PortalUser') is not null
begin
  exec p_ak_drop_all_foreign_keys 'PortalUser'
  drop table PortalUser
end
go

create table PortalUser 
(
  PortalUserId int not null identity(1,1),
  UserName nvarchar(50) not null,
  Password nvarchar(32) not null,
  Name nvarchar(100) not null,
  Active bit not null,
  constraint pk_PortalUserId primary key (PortalUserId)
)
go

exec p_ak_create_fk_indeces 'PortalUser'

insert into PortalUser (UserName, Password, Name, Active) values
('admin', '202CB962AC59075B964B07152D234B70', N'Администратор', 1)
go



if OBJECT_ID('PortalUser2Right') is not null
begin
  exec p_ak_drop_all_foreign_keys 'PortalUser2Right'
  drop table PortalUser2Right
end
go

create table PortalUser2Right 
(
  PortalUser2RightId int not null identity(1,1),
  PortalUserId int not null,
  UserRightId int not null,
  constraint pk_PortalUser2RightId primary key (PortalUser2RightId),
  constraint fk_PortalUser2Right_PortalUserId foreign key (PortalUserId) references PortalUser(PortalUserId) on delete cascade,
  constraint fk_PortalUser2Right_UserRightId foreign key (UserRightId) references UserRight(UserRightId) on delete cascade
)
go

exec p_ak_create_fk_indeces 'PortalUser2Right'

insert into PortalUser2Right (PortalUserId, UserRightId) 
select PortalUserId, UserRightId from PortalUser
join UserRight on 1=1
go


if OBJECT_ID('PortalUser2Part') is not null
begin
  exec p_ak_drop_all_foreign_keys 'PortalUser2Part'
  drop table PortalUser2Part
end
go

create table PortalUser2Part 
(
  PortalUser2PartId int not null identity(1,1),
  PortalUserId int not null,
  PortalPartId int not null,
  constraint pk_PortalUser2PartId primary key (PortalUser2PartId),
  constraint fk_PortalUser2Part_PortalUserId foreign key (PortalUserId) references PortalUser(PortalUserId) on delete cascade,
  constraint fk_PortalUser2Part_PortalPartId foreign key (PortalPartId) references PortalPart(PortalPartId) on delete cascade
)
go

exec p_ak_create_fk_indeces 'PortalUser2Part'

insert into PortalUser2Part (PortalUserId, PortalPartId) 
select PortalUserId, PortalPartId from PortalUser
join PortalPart on 1=1
go



if OBJECT_ID('PortalUser2Group') is not null
begin
  exec p_ak_drop_all_foreign_keys 'PortalUser2Group'
  drop table PortalUser2Group
end
go

create table PortalUser2Group 
(
  PortalUser2GroupId int not null identity(1,1),
  PortalUserId int not null,
  PortalGroupId int not null,
  constraint pk_PortalUser2GroupId primary key (PortalUser2GroupId),
  constraint fk_PortalUser2Group_PortalUserId foreign key (PortalUserId) references PortalUser(PortalUserId) on delete cascade,
  constraint fk_PortalUser2Group_PortalGroupId foreign key (PortalGroupId) references PortalGroup(PortalGroupId) on delete cascade
)
go

exec p_ak_create_fk_indeces 'PortalUser2Group'

go

if OBJECT_ID('Session') is not null
begin
  exec p_ak_drop_all_foreign_keys 'Session'
  drop table Session
end
go

create table Session 
(
  SessionId int not null identity(1,1),
  SessionKey uniqueidentifier not null,
  PortalUserId int not null,
  CreatedOn datetime not null,
  LastEdit datetime not null,
  constraint pk_SessionId primary key (SessionId),
  constraint fk_Session_PortalUserId foreign key (PortalUserId) references PortalUser(PortalUserId) on delete cascade
)
go
exec p_ak_create_fk_indeces 'Session'
go


if OBJECT_ID('PortalGroup2Right') is not null
begin
  exec p_ak_drop_all_foreign_keys 'PortalGroup2Right'
  drop table PortalGroup2Right
end
go

create table PortalGroup2Right 
(
  PortalGroup2RightId int not null identity(1,1),
  PortalGroupId int not null,
  UserRightId int not null,
  constraint pk_PortalGroup2RightId primary key (PortalGroup2RightId),
  constraint fk_PortalGroup2Right_PortalGroupId foreign key (PortalGroupId) references PortalGroup(PortalGroupId) on delete cascade,
  constraint fk_PortalGroup2Right_UserRightId foreign key (UserRightId) references UserRight(UserRightId) on delete cascade
)
go

exec p_ak_create_fk_indeces 'PortalGroup2Right'
go


if OBJECT_ID('PortalGroup2Part') is not null
begin
  exec p_ak_drop_all_foreign_keys 'PortalGroup2Part'
  drop table PortalGroup2Part
end
go

create table PortalGroup2Part 
(
  PortalGroup2PartId int not null identity(1,1),
  PortalGroupId int not null,
  PortalPartId int not null,
  constraint pk_PortalGroup2PartId primary key (PortalGroup2PartId),
  constraint fk_PortalGroup2Part_PortalGroupId foreign key (PortalGroupId) references PortalGroup(PortalGroupId) on delete cascade,
  constraint fk_PortalGroup2Part_PortalPartId foreign key (PortalPartId) references PortalPart(PortalPartId) on delete cascade
)
go

exec p_ak_create_fk_indeces 'PortalGroup2Part'
go

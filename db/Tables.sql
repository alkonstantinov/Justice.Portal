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
(1,'adminusers','Администрация на потребители')

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
  constraint pk_PortalPartId primary key (PortalPartId)
)
go

exec p_ak_create_fk_indeces 'PortalPart'

insert into PortalPart (PortalPartId, Name) values
(1, 'Министерство на правосъдието'),
(2, 'Агенция по вписванията'),
(3, 'Национално бюро за правна помощ'),
(4, 'Централен регистър на особените залози'),
(5, 'ГД "Изпълнение на наказанията"'),
(6, 'ГД "Охрана"')
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
  constraint pk_PortalUserId primary key (PortalUserId)
)
go

exec p_ak_create_fk_indeces 'PortalUser'

insert into PortalUser (UserName, Password, Name) values
('admin', '202CB962AC59075B964B07152D234B70', N'Администратор')
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
  constraint fk_PortalUser2Right_PortalUserId foreign key (PortalUserId) references PortalUser(PortalUserId),
  constraint fk_PortalUser2Right_UserRightId foreign key (UserRightId) references UserRight(UserRightId)
)
go

exec p_ak_create_fk_indeces 'PortalUser2Right'

insert into PortalUser2Right (PortalUserId, UserRightId) 
select PortalUserId, UserRightId from PortalUser
join UserRight on 1=1
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
  constraint fk_Session_PortalUserId foreign key (PortalUserId) references PortalUser(PortalUserId)
)
go
exec p_ak_create_fk_indeces 'Session'
go
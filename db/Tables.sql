use JusticePortal
go


if OBJECT_ID('Log') is not null
begin
  exec p_ak_drop_all_foreign_keys 'Log'
  drop table Log
end
go

CREATE TABLE [Log] (
 
   [Id] int IDENTITY(1,1) NOT NULL,
   [Message] nvarchar(max) NULL,
   [MessageTemplate] nvarchar(max) NULL,
   [Level] nvarchar(128) NULL,
   [TimeStamp] datetimeoffset(7) NOT NULL,  
   [Exception] nvarchar(max) NULL,
   [Properties] xml NULL,
   [LogEvent] nvarchar(max) NULL
 
   CONSTRAINT [PK_Log] 
     PRIMARY KEY CLUSTERED ([Id] ASC) 
 
) 
go

if OBJECT_ID('UserRight') is not null
begin
  exec p_ak_drop_all_foreign_keys 'UserRight'
  drop table UserRight
end
go

create table UserRight 
(
  UserRightId nvarchar(20) not null,  
  Description nvarchar(50) not null,
  constraint pk_UserRightId primary key (UserRightId)
)
go

exec p_ak_create_fk_indeces 'UserRight'

insert into UserRight (UserRightId, Description) values
('adminusers', N'Администрация на потребители'),
('admintemplates', N'Администрация на темплейти'),
('admininstitutions', N'Администрация на институции'),
('admincollections', N'Администрация на колекции'),
('admintranslations', N'Администрация на преводи')


go

if OBJECT_ID('PortalPart') is not null
begin
  exec p_ak_drop_all_foreign_keys 'PortalPart'
  drop table PortalPart
end
go

create table PortalPart 
(
  PortalPartId nvarchar(20) not null,
  Name nvarchar(50) not null,  
  constraint pk_PortalPartId primary key (PortalPartId)
)
go

exec p_ak_create_fk_indeces 'PortalPart'


insert into PortalPart (Name, PortalPartId) values
(N'Министерство на правосъдието', 'min'),
(N'Агенция по вписванията', 'av'),
(N'Национално бюро за правна помощ', 'nbpp'),
(N'Централен регистър на особените залози', 'croz'),
(N'ГД "Изпълнение на наказанията"', 'gdin'),
(N'ГД "Охрана"', 'gdo')
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
  UserRightId nvarchar(20) not null,
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
  PortalPartId nvarchar(20) not null,
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
  UserRightId nvarchar(20) not null,
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
  PortalPartId nvarchar(20) not null,
  constraint pk_PortalGroup2PartId primary key (PortalGroup2PartId),
  constraint fk_PortalGroup2Part_PortalGroupId foreign key (PortalGroupId) references PortalGroup(PortalGroupId) on delete cascade,
  constraint fk_PortalGroup2Part_PortalPartId foreign key (PortalPartId) references PortalPart(PortalPartId) on delete cascade
)
go

exec p_ak_create_fk_indeces 'PortalGroup2Part'
go



if OBJECT_ID('BlockType') is not null
begin
  exec p_ak_drop_all_foreign_keys 'BlockType'
  drop table BlockType
end
go

create table BlockType
(
  BlockTypeId nvarchar(20) not null,
  Name nvarchar(200) not null,
  CanBePage bit not null,
  IsSearchable bit not null,
  constraint pk_BlockTypeId primary key (BlockTypeId)
)
go

insert into BlockType(BlockTypeId,Name,CanBePage, IsSearchable)
values 
  ('main', N'Начална страница', 1, 0),
  ('new', N'Новина', 1, 1),
  ('news', N'Новини', 1, 0),
  ('ad', N'Обявление', 1, 1),
  ('ads', N'Обявления', 1, 0),
  ('text', N'Свободен текст', 1, 1),
  ('live', N'Емисия', 0, 0),
  ('banner', N'Банер', 0, 0),
  ('bio', N'Биография', 1, 1),
  ('biomain', N'Биография министър', 1, 1),
  ('biocabinet', N'Биографии кабинет', 1, 0),
  ('info', N'Кратка информация', 0, 0),
  ('doclist', N'Списък документи', 1, 1),
  ('menu', N'Подменю', 0, 0),
  ('collection', N'Колекция', 1, 1),
  ('ciela', N'Нормативни документи', 1, 1),
  ('buyer', N'Профил на купувача', 1, 1),
  ('newssq', N'Каре новини', 0, 0),
  ('adssq', N'Каре обявления', 0, 0),
  ('search', N'Резултат от търсене', 1, 0),
  ('sitemap', N'Карта на сайта', 1, 0),
  ('html', N'HTML', 0, 0)

exec p_ak_create_fk_indeces 'BlockType'
go



if OBJECT_ID('Property') is not null
begin
  exec p_ak_drop_all_foreign_keys 'Property'
  drop table Property
end
go

create table Property
(
  PropertyId nvarchar(20) not null,
  Name nvarchar(200) not null,
  PropertyType nvarchar(20) not null,

  constraint pk_PropertyId primary key (PropertyId)
)
go
insert into Property(PropertyId, Name, PropertyType)
values 
  ('active', N'Активен', 'check'),
  ('date', N'Дата', 'date'),
  ('institution', N'Институция', 'institution')

exec p_ak_create_fk_indeces 'Property'
go


if OBJECT_ID('Block') is not null
begin
  exec p_ak_drop_all_foreign_keys 'Block'
  drop table Block
end
go

create table Block
(
  BlockId int not null identity(1,1),
  PortalPartId nvarchar(20) not null,
  BlockTypeId nvarchar(20) not null,
  Name nvarchar(200) not null,
  Url nvarchar(500) not null,
  JSONValues nvarchar(max),
  constraint pk_BlockId primary key (BlockId),
  constraint fk_Block_PortalPartId foreign key (PortalPartId) references PortalPart(PortalPartId) on delete cascade,
  constraint fk_Block_BlockTypeId foreign key (BlockTypeId) references BlockType(BlockTypeId) on delete cascade

)
go

create unique index ix_block_url on block(url)

exec p_ak_create_fk_indeces 'Block'
go


if OBJECT_ID('BlockTypeProperty') is not null
begin
  exec p_ak_drop_all_foreign_keys 'BlockTypeProperty'
  drop table BlockTypeProperty
end
go

create table BlockTypeProperty
(
  BlockTypePropertyId int not null identity(1,1),
  BlockTypeId nvarchar(20) not null,
  PropertyId nvarchar(20) not null,
  constraint pk_BlockTypePropertyId primary key (BlockTypePropertyId),
  constraint fk_BlockTypeProperty_BlockTypeId foreign key (BlockTypeId) references BlockType(BlockTypeId) on delete cascade,
  constraint fk_BlockTypeProperty_PropertyId foreign key (PropertyId) references Property(PropertyId) on delete cascade

)
go


insert into BlockTypeProperty(BlockTypeId, PropertyId)
values
  ('main','active'),
  ('new','active'),
  ('new','date'),
  ('news','active'),
  ('newssq','active'),
  ('ad', 'active'),
  ('ads', 'active'),
  ('adssq', 'active'),
  ('text', 'active'),
  ('live', 'active'),
  ('banner', 'active'),
  ('bio', 'active'),
  ('biomain', 'active'),
  ('biocabinet', 'active'),
  ('info', 'active'),
  ('doclist', 'active'),
  ('collection', 'active'),
  ('menu', 'active'),
  ('ciela', 'active'),
  ('buyer', 'active'),
  ('search', 'active'),
  ('sitemap', 'active'),
  ('html', 'active')

insert into BlockTypeProperty(BlockTypeId, PropertyId)
select bt.BlockTypeId, 'institution'
from BlockType bt
where bt.CanBePage = 1

create unique index ix_BlockTypeProperty_BlockTypeId_PropertyId on BlockTypeProperty(BlockTypeId, PropertyId)

exec p_ak_create_fk_indeces 'BlockTypeProperty'
go



if OBJECT_ID('BlockTypePropertyValue') is not null
begin
  exec p_ak_drop_all_foreign_keys 'BlockTypePropertyValue'
  drop table BlockTypePropertyValue
end
go

create table BlockTypePropertyValue
(
  BlockTypePropertyValueId int not null identity(1,1),
  BlockId int not null,
  PropertyId nvarchar(20) not null,
  Value nvarchar(max) null
  constraint pk_BlockTypePropertyValueId primary key (BlockTypePropertyValueId),
  constraint fk_BlockTypePropertyValue_BlockId foreign key (BlockId) references Block(BlockId) on delete cascade,
  constraint fk_BlockTypePropertyValue_PropertyId foreign key (PropertyId) references Property(PropertyId) on delete cascade

)
go

exec p_ak_create_fk_indeces 'BlockTypePropertyValue'
go

if OBJECT_ID('Blob') is not null
begin
  exec p_ak_drop_all_foreign_keys 'Blob'
  drop table Blob
end
go

create table Blob
(
  BlobId int not null identity(1,1),
  Hash nvarchar(32) not null,
  Filename nvarchar(max) not null,
  Extension nvarchar(10) not null,
  Content varbinary(max) not null,
  ContentType nvarchar(100) not null,
  constraint pk_BlobId primary key (BlobId)

)
go

create unique index ix_blob_hash on Blob(hash)
exec p_ak_create_fk_indeces 'Blob'
go




if OBJECT_ID('Template') is not null
begin
  exec p_ak_drop_all_foreign_keys 'Template'
  drop table Template
end
go

create table Template
(
  TemplateId int not null identity(1,1),
  BlockTypeId nvarchar(20) not null,
  PortalPartId nvarchar(20) not null,
  TemplateJSON nvarchar(max),
  Sources nvarchar(max),
  constraint pk_PortalPart2BlockTypeId primary key (TemplateId),
  constraint fk_PortalPart2Block_BlockTypeId foreign key (BlockTypeId) references BlockType(BlockTypeId) on delete cascade,
  constraint fk_PortalPart2Block_PortalPartId foreign key (PortalPartId) references PortalPart(PortalPartId) on delete cascade

)
go

insert into Template(BlockTypeId, PortalPartId)
select bt.BlockTypeId, pp.PortalPartId
from BlockType bt
join PortalPart pp on pp.PortalPartId = 'min' or bt.BlockTypeId not in ('bio','biomain','biocabinet')
where bt.CanBePage=1

exec p_ak_create_fk_indeces 'Template'
go

if OBJECT_ID('Collection') is not null
begin
  exec p_ak_drop_all_foreign_keys 'Collection'
  drop table Collection
end
go

create table Collection
(
  CollectionId int not null identity(1,1),
  Name nvarchar(200) not null,
  Structure nvarchar(max) not null,
  Content nvarchar(max) not null,
  constraint pk_CollectionId primary key (CollectionId)
)
go


exec p_ak_create_fk_indeces 'Collection'
go


if OBJECT_ID('Institution') is not null
begin
  exec p_ak_drop_all_foreign_keys 'Institution'
  drop table Institution
end
go

create table Institution
(
  InstitutionId nvarchar(20) not null,
  Name nvarchar(200) not null,  
  Content nvarchar(max) not null,
  constraint pk_InstitutionId primary key (InstitutionId)
)
go

insert into Institution(InstitutionId, Name, Content)
values('min', N'Министерство', ''),
('vrb', N'Агенция', ''),
('dir', N'Дирекция', '')

exec p_ak_create_fk_indeces 'Institution'
go



if OBJECT_ID('Translation') is not null
begin
  exec p_ak_drop_all_foreign_keys 'Translation'
  drop table Translation
end
go

CREATE TABLE Translation 
(
 
  TranslationId int NOT NULL,
  Content nvarchar(max) not null,
  constraint pk_TranslationId primary key (TranslationId)
)
go
insert into Translation(TranslationId, Content)
values(1, N'{"bg":{"bulgaria":"Република България"},"en":{"bulgaria":"Republic of Bulgaria"}}')

exec p_ak_create_fk_indeces 'Institution'
go

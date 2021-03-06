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
('admincollections', N'Администрация на колекции'),
('admintranslations', N'Администрация на преводи'),
('adminheaders', N'Администрация на заглавни части')



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
  --('biomain', N'Биография министър', 1, 1),
  ('biocabinet', N'Биографии кабинет', 1, 0),
  ('info', N'Кратка информация', 0, 0),
  ('doclist', N'Списък документи', 1, 1),
  ('menu', N'Подменю', 0, 0),
  ('collection', N'Колекция', 1, 1),
  ('ciela', N'Нормативни документи', 1, 1),
  --('buyer', N'Профил на купувача', 1, 1),
  ('newssq', N'Каре новини', 0, 0),
  ('adssq', N'Каре обявления', 0, 0),
  ('search', N'Резултат от търсене', 1, 0),
  ('sitemap', N'Карта на сайта', 1, 0),
  ('html', N'HTML', 0, 0),
  ('pk', N'Профил на купувача', 1, 0),
  ('pkop', N'Обществена поръчка', 1, 1),
  ('pkops', N'Обществени поръчки', 1, 0),
  ('pkoffer', N'Обява за събиране на оферти', 1, 1),
  ('pkoffers', N'Обяви за събиране на оферти', 1, 0),
  ('pkmessage', N'Съобщение', 1, 1),
  ('pkmessages', N'Съобщения', 1, 0),
  ('pkconsult', N'Пазарна консултация', 1, 1),
  ('pkconsults', N'Пазарни консултации', 1, 0)
  
  

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
  ('date', N'Дата', 'date'),
  ('header', N'Заглавна част', 'header')

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
  ('new','date'),
  ('ad', 'date'),
  ('pkop','date'),
  ('pkoffer', 'date'),
  ('pkmessage', 'date'),
  ('pkconsult', 'date')
  
insert into BlockTypeProperty(BlockTypeId, PropertyId)
select bt.BlockTypeId, 'header'
from BlockType bt
where bt.CanBePage = 1 --and bt.BlockTypeId not in (select BlockTypeId from BlockTypeProperty)

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
where bt.CanBePage=1 --and bt.BlockTypeId not in (select BlockTypeId from Template)

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
values(1, N'{"bg":{"link":"Връзка","ads":"Обявления","allads":"Всички обявления","bulgaria":"Република България","emissions":"Емисии","live":"На живо","minister":"Министър на правосъдието на Република България","ministry":"Министерство на правосъдието","news":"Новини","search":"Търсене","searchresult":"Резултат от търсене","start":"Начало","watchlive":"Гледай на живо"},"en":{"link":"Link","ads":"Ads","allads":"All ads","bulgaria":"Republic of Bulgaria","emissions":"Emissions","live":"Live","minister":"Minister of Justice","ministry":"Ministry of justice","news":"News","search":"Search","searchresult":"Search Result","start":"Main","watchlive":"Watch live"}}')

exec p_ak_create_fk_indeces 'Translation'
go


if OBJECT_ID('Header') is not null
begin
  exec p_ak_drop_all_foreign_keys 'Header'
  drop table Header
end
go

CREATE TABLE Header
(
 
  HeaderId int NOT NULL identity(1,1),
  Title nvarchar(max) not null,
  Content nvarchar(max) not null,
  constraint pk_HeaderId primary key (HeaderId)
)
go

exec p_ak_create_fk_indeces 'Header'
go


if OBJECT_ID('PKLabel') is not null
begin
  exec p_ak_drop_all_foreign_keys 'PKLabel'
  drop table PKLabel
end
go

CREATE TABLE PKLabel
(
 
  PKLabelId int NOT NULL,
  PKLabelGroup nvarchar(5) NOT NULL,
  TitleBG nvarchar(max) not null,
  TitleEN nvarchar(max) null,
  constraint pk_PKLabelId primary key (PKLabelId)
)
go

create index ix_PKLabel_PKLabelGroup on PKLabel(PKLabelGroup)
exec p_ak_create_fk_indeces 'PKLabelId'


insert into PKLabel(PKLabelId, TitleBG, PKLabelGroup)
values
  (1,N'решение за откриване на процедурите и обявление за обществена поръчка','ft'),
	(2,N'документация за участие в процедурите','ft'),
	(3,N'обявление по чл. 25 от ЗОП с приложения (ако такива са налични)','ft'),
	(4,N'разясненията по документациите за участие','ft'),
	(5,N'покана за представяне на оферти при ограничена процедура, състезателен диалог и договаряне с обявление','ft'),
	(6,N'протоколи и/или окончателни доклади на комисиите за провеждане на процедурите заедно с приложенията към тях','ft'),
	(7,N'решение по чл. 38 от ЗОП за завършване на процедурите','ft'),
	(8,N'договорите за обществени поръчки заедно със задължителните приложения към тях','ft'),
	(9,N'договорите за подизпълнение и допълнителните споразумения към тях','ft'),
	(10,N'рамкови споразумения заедно със задължителните приложения към тях','ft'),
	(11,N'допълнителните споразумения за изменения на договорите за обществени поръчки','ft'),
	(12,N'публични покани по чл. 101б заедно с приложенията към тях','ft'),
	(13,N'становище на АОП по предварителния контрол','ft'),
	(14,N'одобрените от изпълнителния директор на АОП експертни становища от осъществявания предварителен контрол','ft'),
	(15,N'информация по чл. 45, ал. 2 ЗОП','ft'),
	(16,N'покана за участие в процедура по чл. 18, ал.1, т. 3-5 ЗОП','ft'),
	(17,N'покана за участие в процедура по  чл. 18, ал.3 ЗОП','ft'),
	(18,N'покана за участие в процедура по чл. 18, ал. 5 ЗОП','ft'),
	(19,N'решение по чл. 22, ал.1, т. 4 ЗОП  за предварителен подбор','ft'),
	(20,N'решение по чл. 22, ал. 1 ЗОП','ft'),
	(21,N'предварително обявление по чл. 23 ЗОП','ft'),
	(22,N'разяснения по условията на процедурата','ft'),
	(23,N'информация по чл. 44, ал. 3 от ЗОП (пазарни консултации)','ft'),
	(24,N'обявление по чл. 178, ал. 1 ЗОП (откриване на процедура за публично състезание)','ft'),
	(25,N'рамково споразумение','ft'),
	(26,N'разяснения по процедурата','ft'),
	(27,N'обява по чл. 187, ал. 1 от ЗОП за събиране на оферти','ft'),
	(28,N'разяснения по чл. 189 от ЗОП','ft'),
	(29,N'решение за откриване на процедура с ниска стойност','ft'),
	(30,N'покана по чл. 191 от ЗОП','ft'),
	(31,N'съобщение с мотиви за оттегляне на обявата по чл. 193 от ЗОП','ft'),
	(32,N'договор с приложения (процедури с ниска стойност)','ft'),
	(33,N'покани до определени лица','ft'),
	(34,N'проект на техническите спецификации и методиката за оценка','ft'),
	(35,N'покана до лицата по рамковото споразумение за провеждане на вътрешен конкурентен избор','ft'),
	(36,N'решение за назначаване на комисия по чл. 82, ал. 4, т. 4 ЗОП','ft'),
	(37,N'протокол на комисията за разглеждане и класиране на офертите при вътрешен конкурентен избор','ft'),
	(38,N'решение за определяне на изпълнител след вътрешен конкурентен избор','ft'),
	(39,N'техническо предложение на участника','ft'),
	(40,N'ДРУГО','ft'),


  (100, N'Открита процедура', N'pt'),
(101, N'Ограничена процедура', N'pt'),
(102, N'Състезателна процедура с договаряне', N'pt'),
(103, N'Договаряне без предварително обявление', N'pt'),
(104, N'Състезателен диалог', N'pt'),
(105, N'Конкурс за проект', N'pt'),
(106, N'Договаряне с предварителна покана за участие', N'pt'),
(107, N'Договаряне с публикуване на обявление за поръчка', N'pt'),
(108, N'Партньорство за иновации', N'pt'),
(109, N'Договаряне без предварителна покана за участие', N'pt'),
(110, N'Договаряне без публикуване на обявление за поръчка', N'pt'),
(111, N'Публично състезание', N'pt'),
(112, N'Пряко договаряне', N'pt'),
(113, N'публично състезание', N'pt'),
(114, N'пряко договаряне', N'pt'),
(115, N'събиране на оферти с обява', N'pt'),
(116, N'процедура по чл. 191 и сл. от ЗОП', N'pt'),

(200, N'доставки', N'obj'),
(201, N'услуги', N'obj'),
(202, N'строителство', N'obj'),

(300, N'отворена', N'sta'),
(301, N'прекратена', N'sta'),
(302, N'спряна', N'sta'),
(303, N'отменена', N'sta'),
(304, N'затворена', N'sta'),
(305, N'възложена', N'sta'),
(306, N'приключена', N'sta'),
(307, N'Частично спряна', N'sta'),
(308, N'Частично прекратена', N'sta'),
(309, N'Частично възложена и частично прекратена', N'sta'),

(401, N'BG3 - Северна и Югоизточна България', N'nuts'),
(402, N'BG31 - Северозападен', N'nuts'),
(403, N'BG311 - Видин', N'nuts'),
(404, N'BG312 - Монтана', N'nuts'),
(405, N'BG313 - Враца', N'nuts'),
(406, N'BG314 - Плевен', N'nuts'),
(407, N'BG315 - Ловеч', N'nuts'),
(408, N'BG32 - Северен централен', N'nuts'),
(409, N'BG321 - Велико Търново', N'nuts'),
(410, N'BG322 - Габрово', N'nuts'),
(411, N'BG323 - Русе', N'nuts'),
(412, N'BG324 - Разград', N'nuts'),
(413, N'BG325 - Силистра', N'nuts'),
(414, N'BG33 - Североизточен', N'nuts'),
(415, N'BG331 - Варна', N'nuts'),
(416, N'BG332 - Добрич', N'nuts'),
(417, N'BG333 - Шумен', N'nuts'),
(418, N'BG334 - Търговище', N'nuts'),
(419, N'BG34 - Югоизточен', N'nuts'),
(420, N'BG341 - Бургас', N'nuts'),
(421, N'BG342 - Сливен', N'nuts'),
(422, N'BG343 - Ямбол', N'nuts'),
(230, N'BG344 - Стара Загора', N'nuts'),
(424, N'BG4 - Югозападна и Южна Централна България', N'nuts'),
(425, N'BG41 - Югозападен', N'nuts'),
(426, N'BG411 - София (столица)', N'nuts'),
(427, N'BG412 - София', N'nuts'),
(428, N'BG413 - Благоевград', N'nuts'),
(429, N'BG414 - Перник', N'nuts'),
(430, N'BG415 - Кюстендил', N'nuts'),
(431, N'BG42 - Южен централен', N'nuts'),
(432, N'BG421 - Пловдив', N'nuts'),
(433, N'BG422 - Хасково', N'nuts'),
(434, N'BG423 - Пазарджик', N'nuts'),
(435, N'BG424 - Смолян', N'nuts'),
(436, N'BG425 - Кърджали', N'nuts'),
(437, N'BG - България', N'nuts'),

(500, N'КНИГОПЕЧАТАНЕ И ИЗДАВАНЕ', 'bus'),
(501, N'КОМПЮТЪРНИ И СРОДНИ УСЛУГИ', 'bus'),
(502, N'ТЕХНОЛОГИИ И ОБОРУДВАНЕ', 'bus'),
(503, N'МАТЕРИАЛИ И ПРОДУКТИ', 'bus'),
(504, N'ОКОЛНА СРЕДА И УПРАВЛЕНИЕ НА ОТПАДЪЦИТЕ', 'bus'),
(505, N'СЕЛСКО СТОПАНСТВО И ХРАНИ', 'bus'),
(506, N'СТРОИТЕЛСТВО И НЕДВИЖИМИ ИМОТИ', 'bus'),
(507, N'ТРАНСПОРТИ И СРОДНИ УСЛУГИ', 'bus'),
(508, N'ФИНАНСОВИ И СРОДНИ УСЛУГИ', 'bus'),
(509, N'АРХИТЕКТУРА И ДИЗАЙН НА СГРАДИ', 'bus'),
(510, N'СТРОИТЕЛСТВО НА СГРАДИ И СЪОРЪЖЕНИЯ', 'bus'),
(511, N'ЕНЕРГИЙНА ЕФЕКТИВНОСТ', 'bus'),
(512, N'СТРОИТЕЛНИ КОНСТРУКЦИИ', 'bus'),
(513, N'ХИДРОИНЖЕНЕРСТВО', 'bus'),
(514, N'ВИК ИНЖЕНЕРСТВО', 'bus'),
(515, N'ЕЛЕКТРОИНЖЕНЕРСТВО', 'bus'),
(516, N'ИНЖЕНЕРСТВО, ПРОФИЛ ГЕОЗАЩИТНИ ДЕЙНОСТИ', 'bus'),
(517, N'ИНЖЕНЕРСТВО, ПРОФИЛ ОТОПЛИТЕЛНИ, ВЕНТИЛАЦИОННИ И КЛИМАТИЗАЦИОННИ ИНСТАЛАЦИИ', 'bus'),
(518, N'ИНЖЕНЕРСТВО, ПРОФИЛ ПЪТНО/ТРАНСПОРТНО СТРОИТЕЛСТВО', 'bus'),
(519, N'ИНЖЕНЕРСТВО, ПРОФИЛ ПОЖАРНА БЕЗОПАСНОСТ И БЕЗОПАСНОСТ НА ТРУДА', 'bus'),
(520, N'ИНЖЕНЕРСТВО, ПРОФИЛ АВТОМАТИКА', 'bus'),
(521, N'ИНЖЕНЕРСТВО, ПРОФИЛ ТЕХНОЛОГИЯ НА ХРАНИТЕЛНО-ВКУСОВА ПРОМИШЛЕНОСТ', 'bus'),
(522, N'ИНЖЕНЕРСТВО, ПРОФИЛ ТРАНСПОРТ', 'bus'),
(523, N'ЕЛЕКТРОНИКА', 'bus'),
(524, N'ХИМИЧЕСКИ ТЕХНОЛОГИИ', 'bus'),
(525, N'МАШИННО ИНЖЕНЕРСТВО', 'bus'),
(526, N'АВИО-ИНЖЕНЕРСТВО', 'bus'),
(527, N'КОРАБНО ИНЖЕНЕРСТВО – КОРАБОСТРОЕНЕ, КОРАБОВОДЕНЕ, КОРАБНИ МАШИНИ И МЕХАНИЗМИ', 'bus'),
(528, N'ТЕКСТИЛНО ИНЖЕНЕРСТВО', 'bus'),
(529, N'ТЕХНОЛОГИЯ НА ОБЛЕКЛОТО', 'bus'),
(530, N'СИСТЕМИ ЗА УПРАВЛЕНИЕ НА ТРАФИКА', 'bus'),
(531, N'СИСТЕМИ ЗА УПРАВЛЕНИЕ НА СИГУРНОСТТА', 'bus'),
(532, N'ГЕОГРАФСКИ ИНФОРМАЦИОННИ СИСТЕМИ', 'bus'),
(533, N'ПРОУЧВАНЕ, ДОБИВ И ОБРАБОТКА НА ПОЛЕЗНИ ИЗКОПАЕМИ', 'bus'),
(534, N'НАУКИ ЗА ЗЕМЯТА (ГЕОГРАФИЯ, ГЕОЛОГИЯ, ГЕОДЕЗИЯ И др.)', 'bus'),
(535, N'МЕТАЛУРГИЯ', 'bus'),
(536, N'ЕНЕРГЕТИКА', 'bus'),
(537, N'ЛАНДШАФТНА АРХИТЕКТУРА', 'bus'),
(538, N'ТЕЛЕКОМУНИКАЦИИ', 'bus'),
(539, N'ИНФОРМАЦИОННИ И КОМУНИКАЦИОННИ ТЕХНОЛОГИИ', 'bus'),
(540, N'ИНФОРМАТИКА И КОМПЮТЪРНИ НАУКИ', 'bus'),
(541, N'КОМУНИКАЦИОННА И КОМПЮТЪРНА ТЕХНИКА', 'bus'),
(542, N'АРХЕОЛОГИЯ', 'bus'),
(543, N'ОПАЗВАНЕ НА КУЛТУРНОТО НАСЛЕДСТВО', 'bus'),
(544, N'СОЦИАЛНИ ДЕЙНОСТИ, СОЦИАЛЕН МЕНИДЖМЪНТ, УПРАВЛЕНИЕ И КОНТРОЛ НА УСЛОВИЯТА НА ТРУД И СОЦИАЛНО ПРЕДПРИЕМАЧЕСТВО', 'bus'),
(545, N'АДМИНИСТРАЦИЯ И УПРАВЛЕНИЕ', 'bus'),
(546, N'ЕЛЕКТРОННО УПРАВЛЕНИЕ', 'bus'),
(547, N'ПРАВО', 'bus'),
(548, N'ПСИХОЛОГИЯ', 'bus'),
(549, N'СОЦИОЛОГИЯ', 'bus'),
(550, N'ИСТОРИЯ', 'bus'),
(551, N'НАУКИ ЗА КУЛТУРАТА', 'bus'),
(552, N'ХИМИЧЕСКИ НАУКИ', 'bus'),
(553, N'ФИЗИЧЕСКИ НАУКИ', 'bus'),
(554, N'БИОЛОГИЧЕСКИ НАУКИ', 'bus'),
(555, N'МЕДИЦИНА', 'bus'),
(556, N'ДЕНТАЛНА МЕДИЦИНА И ЗЪБОТЕХНИКА', 'bus'),
(557, N'ФАРМАЦИЯ', 'bus'),
(558, N'МЕДИЦИНСКА ТЕХНИКА', 'bus'),
(559, N'БОТАНИКА', 'bus'),
(560, N'БИОТЕХНОЛОГИИ', 'bus'),
(561, N'РАСТЕНИЕВЪДСТВО', 'bus'),
(562, N'ЖИВОТНОВЪДСТВО', 'bus'),
(563, N'ЖИВОТНОВЪДСТВО, ПРОФИЛ РИБОВЪДСТВО И АКВАКУЛТУРА', 'bus'),
(564, N'ГОРСКО СТОПАНСТВО', 'bus'),
(565, N'ВЕТЕРИНАРНА МЕДИЦИНА', 'bus'),
(566, N'МИКРОБИОЛОГИЯ', 'bus'),
(567, N'ЕКОЛОГИЯ', 'bus'),
(568, N'ХИДРОБИОЛОГИЯ', 'bus'),
(569, N'ПЕДАГОГИЧЕСКИ НАУКИ', 'bus'),
(570, N'ИКОНОМИКА, ПРОФИЛ ИКОНОМИКА И ОРГАНИЗАЦИЯ НА ТРУДА', 'bus'),
(571, N'ИКОНОМИКА, ПРОФИЛ СЧЕТОВОДСТВО И КОНТРОЛ', 'bus'),
(572, N'ИКОНОМИКА, ПРОФИЛ ФИНАНСИ', 'bus'),
(573, N'ФИНАНСОВ И ИКОНОМИЧЕСКИ АНАЛИЗ', 'bus'),
(574, N'ЗАСТРАХОВАТЕЛНА И/ИЛИ ОСИГУРИТЕЛНА ДЕЙНОСТ', 'bus'),
(575, N'ТУРИЗЪМ', 'bus'),
(576, N'ХРАНИТЕЛНО-ВКУСОВА ПРОМИШЛЕНОСТ', 'bus'),
(577, N'ИЗКУСТВА', 'bus'),
(578, N'ДИЗАЙН И РЕКЛАМА', 'bus'),
(579, N'НАЦИОНАЛНА СИГУРНОСТ', 'bus'),
(580, N'ВОЕННО ДЕЛО', 'bus')

  go


  
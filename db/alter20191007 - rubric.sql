use JusticePortal
go


if OBJECT_ID('Rubric') is not null
begin
  exec p_ak_drop_all_foreign_keys 'Rubric'
  drop table Rubric
end
go

create table Rubric
(
  RubricId int not null identity(1,1),
  PortalPartId nvarchar(20) not null,  
  TitleBG nvarchar(max) not null,
  TitleEN nvarchar(max) not null,
  constraint pk_RubricId primary key (RubricId),
  constraint fk_Rubric_PortalPartId foreign key (PortalPartId) references PortalPart(PortalPartId) on delete cascade
)
go


exec p_ak_create_fk_indeces 'Rubric'
go

insert into Rubric (PortalPartId, TitleBG, TitleEN)
select PortalPartId, N'Обща информация', N'Common info' from PortalPart

insert into [dbo].[UserRight] (UserRightId, Description)
values ('rubricedit', N'Редакция на рубрики')

insert into [dbo].[PortalUser2Right](PortalUserId, UserRightId)
values(1, 'rubricedit')
go

alter table Block
add RubricId int
go 

alter table Block
add constraint fk_Block_RubricID foreign key (RubricId) references Rubric(RubricId) 



update b
set b.RubricId = r.RubricId
from Block b
join Rubric r on r.PortalPartId =b.PortalPartId



ALTER TABLE Block
alter column RubricId int NOT NULL;


create index ix_block_rubricId on Block(RubricId)
go


if OBJECT_ID('PortalUser2Rubric') is not null
begin
  exec p_ak_drop_all_foreign_keys 'PortalUser2Rubric'
  drop table PortalUser2Rubric
end
go

create table PortalUser2Rubric 
(
  PortalUser2RubricId int not null identity(1,1),
  PortalUserId int not null,
  RubricId int not null,
  constraint pk_PortalUser2RubricId primary key (PortalUser2RubricId),
  constraint fk_PortalUser2Rubric_PortalUserId foreign key (PortalUserId) references PortalUser(PortalUserId) on delete cascade,
  constraint fk_PortalUser2Rubric_RubricId foreign key (RubricId) references Rubric(RubricId) on delete cascade
)
go

exec p_ak_create_fk_indeces 'PortalUser2Rubric'

insert into PortalUser2Rubric (PortalUserId, RubricId) 
select PortalUserId, RubricId from PortalUser
join Rubric on 1=1
go


if OBJECT_ID('PortalGroup2Rubric') is not null
begin
  exec p_ak_drop_all_foreign_keys 'PortalGroup2Rubric'
  drop table PortalGroup2Rubric
end
go

create table PortalGroup2Rubric 
(
  PortalGroup2RubricId int not null identity(1,1),
  PortalGroupId int not null,
  RubricId int not null,
  constraint pk_PortalGroup2RubricId primary key (PortalGroup2RubricId),
  constraint fk_PortalGroup2Rubric_PortalGroupId foreign key (PortalGroupId) references PortalGroup(PortalGroupId) on delete cascade,
  constraint fk_PortalGroup2Rubric_RubricId foreign key (RubricId) references Rubric(RubricId) on delete cascade
)
go

exec p_ak_create_fk_indeces 'PortalGroup2Rubric'

insert into PortalGroup2Rubric (PortalGroupId, RubricId) 
select PortalGroupId, RubricId from PortalGroup
join Rubric on 1=1
go
declare @btid int

insert into BlockType(BlockTypeId,Name,CanBePage, IsSearchable)
values 
  ('career', N'Кариери', 1, 1)

select @btid = @@IDENTITY


insert into Template(BlockTypeId, PortalPartId)
select bt.BlockTypeId, pp.PortalPartId
from BlockType bt
join PortalPart pp on pp.PortalPartId = 'min' or bt.BlockTypeId not in ('bio','biomain','biocabinet')
where bt.CanBePage=1 and bt.BlockTypeId not in (select BlockTypeId from Template)

insert into BlockTypeProperty(BlockTypeId, PropertyId)
select bt.BlockTypeId, 'header'
from BlockType bt
where bt.CanBePage = 1 and bt.BlockTypeId not in (select BlockTypeId from BlockTypeProperty)
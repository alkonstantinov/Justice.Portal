use JusticePortal
go

alter table block
  add IsMain bit not null default 0
go


create unique index ix_block_part_main on block(PortalPartId,IsMain) where IsMain=1
go
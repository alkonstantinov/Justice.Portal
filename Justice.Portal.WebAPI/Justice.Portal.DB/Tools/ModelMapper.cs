using AutoMapper;
using Justice.Portal.DB.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Justice.Portal.DB.JSModels;

namespace Justice.Portal.DB.Tools
{
    internal class ModelMapper
    {
        private readonly IMapper _map;
        public IMapper Mapper => _map;

        private static readonly Lazy<ModelMapper> _self = new Lazy<ModelMapper>(() => new ModelMapper());

        public static ModelMapper Instance => _self.Value;

        private ModelMapper()
        {
            var config = new MapperConfiguration(cfg =>
            {

                cfg.CreateMap<LoginResponse, PortalUser>()
                    .ReverseMap();
                cfg.CreateMap<JSPortalGroup, PortalGroup>()
                    .ReverseMap();
                cfg.CreateMap<JSPortalPart, PortalPart>()
                    .ReverseMap();
                cfg.CreateMap<JSUserRight, UserRight>()
                    .ReverseMap();


            }
            );


            _map = config.CreateMapper();
        }



    }
}

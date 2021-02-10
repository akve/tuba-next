import { Context, GET, Path, PreProcessor, PathParam, ServiceContext } from 'typescript-rest';
import { attachmentsService } from '../services/attachmentsService';
import { RequestPreProcess } from '../utils/request-with-user';
import {LookupsController} from "./lookups";
@Path('/v1/open')
@PreProcessor(RequestPreProcess)
export class OpenController {
  @Context
  public context: ServiceContext;

  @Path('/attachment/:id')
  @GET
  public async getAttachment(@PathParam('id') id: number): Promise<any> {
    const path = await attachmentsService.getPathById(id);
    if (!path) return null;
    const fullPath = attachmentsService.getFileLocation(path);
    return fullPath;
  }

  @Path('/alldata')
  @GET
  public async getAllData(): Promise<any> {
    const lookupsController = new LookupsController() ;
    lookupsController.context = this.context;
    const data: any = {};
    data.categories = await lookupsController.categoriesLookup(null);
    return data;
  }
}

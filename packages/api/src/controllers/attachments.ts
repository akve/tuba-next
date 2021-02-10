import { Context, GET, POST, DELETE, Path, PreProcessor, PathParam, ServiceContext } from 'typescript-rest';
import { attachmentsService } from '../services/attachmentsService';
import { Attachment } from '@pdeals/models/entities/Attachment';
import { SimpleResponseDto } from '@pdeals/models/dto/SimpleResponseDto';
import { getTypeormManager } from '../../../db';
import { RequestPreProcess, RequestWithLogin } from '../utils/request-with-user';
import { AttachmentWithContentDto } from '@pdeals/models/dto/AttachmentDto';

@Path('/v1/attachments')
@PreProcessor(RequestPreProcess)
@PreProcessor(RequestWithLogin)
export class GeneralController {
  @Context
  public context: ServiceContext;

  @Path('/:ids')
  @GET
  public async getAttachment(@PathParam('ids') ids: string): Promise<Attachment[]> {
    const idsArray = ids.split(',');
    const res: Attachment[] = [];
    let id = 0;
    for (let i = 0; i < idsArray.length; i++) {
      id = parseInt(idsArray[i]);
      if (id && !isNaN(id)) {
        res.push(await attachmentsService.getById(id));
      }
    }
    return res;
  }

  @Path('/:id')
  @DELETE
  public async attachmentDelete(@PathParam('id') id: number): Promise<any> {
    const repo = await getTypeormManager().getRepository(Attachment);
    const record = await repo.findOne(id);
    if (!record) throw new Error('Not found');
    await repo.remove(record);
    return new SimpleResponseDto('ok');
  }

  @Path('/')
  @POST
  public async saveAttachment(payload: AttachmentWithContentDto): Promise<any> {
    return await attachmentsService.attachSingle(payload);
  }
}

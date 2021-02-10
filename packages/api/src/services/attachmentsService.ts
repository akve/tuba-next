import { getTypeormManager } from '@pdeals/db';
import { Attachment } from '@pdeals/models/entities/Attachment';
import config from '../lib/config';
import * as fs from 'fs';
import { manualSync } from 'mkdirp';
import { v4 } from 'uuid';
import { AttachmentWithContentDto } from '@pdeals/models/dto/AttachmentDto';

const attach = async (attachments: AttachmentWithContentDto[]) => {
  const result = [];
  let _res;
  if (attachments.length) {
    for (let i = 0; i < attachments.length; i++) {
      _res = await attachSingle(attachments[i]);
      result.push(_res.id);
    }
    return result.join(',');
  }
  return ''; // await attachSingle(attachments);
};

const attachSingle = async (attach: AttachmentWithContentDto) => {
  const { filename, filetype, to_model, to_id, content, data } = attach;
  const folder = `${to_model}/${to_id ? to_id + '/' : '0/'}`;
  manualSync(`${config.uploadsPath}/${folder}`);
  const fileName = v4();
  const filePath = `${folder}${fileName}_${filename}`;
  fs.writeFileSync(`${config.uploadsPath}/${filePath}`, content.replace(/^(.*?);base64,/, ''), 'base64');
  const repo = await getTypeormManager().getRepository(Attachment);
  const record = repo.create({
    filename,
    filetype,
    data: data || {},
    to_model: to_model || '',
    to_id: to_id || 0,
    location: filePath,
  });
  // suppose there should be 'data' field
  if (!(record as any).data) (record as any).data = {};
  return await repo.save(record);
};

const getById = async (id: number): Promise<Attachment | null> => {
  const attach = await Attachment.findOne(id);
  return attach || null;
};

const getPathById = async (id: number): Promise<string> => {
  const attach = await Attachment.findOne(id);
  if (!attach) return '';
  return attach.location;
};

const getFileLocation = (location: string) => {
  return `../${config.uploadsPath}/${location}`;
};

export const attachmentsService = {
  getById,
  getFileLocation,
  getPathById,
  attachSingle,
  attach,
};

// import { UserDto } from './UserDto';
import { Attachment } from '../entities/Attachment';

class AttachmentWithContentDto extends Attachment {
  content: string;
}

export { AttachmentWithContentDto };

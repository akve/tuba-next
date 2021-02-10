import { useState, useEffect, useRef } from 'react';
import { FormGroup, Input, Button } from 'reactstrap';
import { registerRenderer } from './index';
import { AttachmentsApi } from '@pdeals/next/lib/api/attachments-api';
import getBase64 from '@pdeals/next/utils/getBase64';

const Attachment = ({
  class: className,
  label,
  name,
  fieldSpecificParams: attachOptions,
  setValue,
  innerRef,
  value,
  entityId,
  disabled,
}) => {
  const fileInput: any = useRef(null);
  const [uiAttachments, setUiAttachments] = useState<any>([]);
  const allowMultiple = !!attachOptions.multiple;

  useEffect(() => {
    pushAttachmentFromProps();
  }, [value]);

  const pushAttachmentFromProps = async () => {
    const existingAttachment = value;
    if (existingAttachment) {
      const attachments: any = await AttachmentsApi().getAttaches(value);
      setUiAttachments(attachments);
    }
  };

  const getUrl = (file) => {
    return `${AttachmentsApi().attachmentBase}/${file}`;
  };

  const onUpload = async (e) => {
    const { files } = e.target;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fname = file.name;

      const attachData = await getBase64(file);
      const entity: any = await AttachmentsApi().upload({
        to_model: attachOptions.entityName,
        to_id: entityId,
        filename: fname,
        filetype: '',
        content: attachData,
        data: {},
      });
      const newId = entity.id;
      const arrayIds = allowMultiple && value ? value.split(',') : [];
      arrayIds.push(newId);
      setValue(name, `${arrayIds.join(',')}`);
      if (fileInput && fileInput.current) {
        // tslint:disable-next-line
        fileInput!.current!.value = '';
      }
    }
  };

  const removeAttachment = (removedId) => {
    const arrayIds = value ? value.split(',') : [];
    const newArrayIds = arrayIds.filter((id) => String(id) !== String(removedId));
    setValue(name, `${newArrayIds.join(',')}`);
  };

  const isImage = (filename) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.svg)$/i;
    return !!allowedExtensions.exec(filename);
  };

  const attachmentsIds = value ? value.split(',') : [];
  const attachments = uiAttachments.filter((item) => attachmentsIds.indexOf(String(item.id)) !== -1);

  return (
    <FormGroup className={className}>
      {label && <label className="form-control-label">{label}</label>}
      <div className="uploads">
        {attachments &&
          attachments.map((attachment) => (
            <div className="uploads-item" key={attachment.id}>
              <div className="uploads-item__file">
                {isImage(attachment.filename) ? (
                  <img
                    src={getUrl(attachment.location)}
                    alt={attachment.filename}
                    className="uploads-item__img"
                    onClick={() => window.open(getUrl(attachment.location), '_blank')}
                  />
                ) : (
                  <i
                    className="uploads-item__icon ni ni-app"
                    onClick={() => window.open(getUrl(attachment.location), '_blank')}
                  />
                )}
                {!disabled && (
                  <i
                    className="uploads-item__delete ni ni-fat-delete"
                    onClick={() => removeAttachment(attachment.id)}
                  />
                )}
              </div>
              <span className="uploads-item__title" title={attachment.filename}>
                {attachment.filename}
              </span>
            </div>
          ))}
        <Button
          onClick={() => {
            if (fileInput && fileInput.current) fileInput.current.click();
          }}
          color="light"
          type="button"
          size="sm"
        >
          upload
        </Button>
        <input style={{ display: 'none' }} type="file" ref={fileInput} onChange={onUpload} />
        <Input type="text" name={name} innerRef={innerRef} style={{ display: 'none' }} />
      </div>
    </FormGroup>
  );
};

const RegisterAttachment = () => {
  registerRenderer('attachments', Attachment);
};

export default RegisterAttachment;

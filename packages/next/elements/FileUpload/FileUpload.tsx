import { useEffect, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { useRouter } from 'next/router';
import XLSX from 'xlsx';
import { FileDrop } from '@pdeals/next/elements/FileUpload/FileDrop';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
interface IProps {
  onUpload: any;
}

function FileUpload(props: IProps) {
  const fileInputRef = useRef(null);

  const onFileInputChange = (event) => {
    const { files } = event.target;
    // do something with your files...
    onProceedUpload(files);
  };

  const onTargetClick = () => {
    if (!fileInputRef || !fileInputRef.current) return;
    (fileInputRef.current as any).click();
  };

  const onProceedUpload = (files: FileList | null) => {
    if (!files) return;
    console.log('Uploading', files);
    if (props.onUpload) {
      props.onUpload(files);
    }
  };
  // const handleFile = (file/*:File*/) => {
  //     /* Boilerplate to set up FileReader */
  //     const reader = new FileReader();
  //     const rABS = !!reader.readAsBinaryString;
  //     reader.onload = (e) => {
  //         /* Parse data */
  //         const bstr = e.target.result;
  //         const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
  //         /* Get first worksheet */
  //         const wsname = wb.SheetNames[0];
  //         const ws = wb.Sheets[wsname];
  //         /* Convert array of arrays */
  //         const data = XLSX.utils.sheet_to_json(ws, {header:1});
  //         /* Update state */
  //         this.setState({ data: data, cols: make_cols(ws['!ref']) });
  //     };
  //     if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
  // };

  return (
    <div>
      <input onChange={onFileInputChange} ref={fileInputRef} type="file" style={{ display: 'none' }} />
      {/*
              onFrameDragEnter={(event) => console.log('onFrameDragEnter', event)}
        onFrameDragLeave={(event) => console.log('onFrameDragLeave', event)}
        onFrameDrop={(event) => console.log('onFrameDrop', event)}
        onDragOver={(event) => console.log('onDragOver', event)}
        onDragLeave={(event) => console.log('onDragLeave', event)}

      */}
      <FileDrop onDrop={(files, event) => onProceedUpload(files)} onTargetClick={onTargetClick}>
        Drop .XLSX or .CSV file
      </FileDrop>
    </div>
  );
}

export default FileUpload;

import { client } from '@pdeals/next/lib/api/api-client';

const downloadApiFile = async (apiUrl: string, method: string, params: any, fileName: string) => {
    const response = await client({responseTypeIsBlob: true})[method](apiUrl, params);
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); //or any other extension
    document.body.appendChild(link);
    link.click();
}
export { downloadApiFile }
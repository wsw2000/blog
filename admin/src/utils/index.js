import { message } from 'antd';

export const timeFilter = (value) =>{
  let time = new Date(value)
  let year = time.getFullYear()
  let month = (time.getMonth() + 1 + '').padStart(2, '0')
  let date = (time.getDate() + '').padStart(2, '0')


  return `${year}-${month}-${date}`
}

export const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
 
export const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('仅支持JPG/PNG文件');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片必须小于2MB!');
  }
  return isJpgOrPng && isLt2M;
}
import axios, { AxiosRequestConfig } from 'axios';
import { environment } from '../../src/environments/environment';

export const httpPost = async (path: string, body: any, headers: any) => {
  let build_header = await getHeaders(headers);

  const config: AxiosRequestConfig = {
    method: 'post',
    url: environment.backendUrl + path,
    headers: build_header,
    data: body,
  };

  return await axios(config)
    .then((d: any) => {
      if (d.data) {
        return { statusCode: 200, ...d.data };
      } else {
        return {
          statusCode: 200,
          status: false,
          message: 'Please try again later ERRCODE[100]',
        };
      }
    })
    .catch((err: any) => {
      return handleErrorResponse(err);
    });
};

export const httpGet = async (path: string, headers: any) => {
  let build_header = await getHeaders(headers);

  const config: AxiosRequestConfig = {
    method: 'get',
    url: environment.backendUrl + path,
    headers: build_header,
  };

  return await axios(config)
    .then((d: any) => {
      if (d.data) {
        return { statusCode: 200, ...d.data };
      } else {
        return {
          status: false,
          statusCode: 200,
          message: 'Please try again later ERRCODE[101]',
        };
      }
    })
    .catch((err: any) => {
      return handleErrorResponse(err);
    });
};

export const httpPut = async (path: string, body: any, headers: any) => {
  let build_header = await getHeaders(headers);

  const config: AxiosRequestConfig = {
    method: 'put',
    url: environment.backendUrl + path,
    headers: build_header,
    data: body,
  };

  return await axios(config)
    .then((d: any) => {
      if (d.data) {
        return { statusCode: 200, ...d.data };
      } else {
        return {
          status: false,
          statusCode: 200,
          message: 'Please try again later ERRCODE[100]',
        };
      }
    })
    .catch((err: any) => {
      return handleErrorResponse(err);
    });
};

export const httpDelete = async (path: string, headers: any) => {
  let build_header = await getHeaders(headers);

  const config: AxiosRequestConfig = {
    method: 'delete',
    url: environment.backendUrl + path,
    headers: build_header,
  };

  return await axios(config)
    .then((d: any) => {
      if (d.data) {
        return { statusCode: 200, ...d.data };
      } else {
        return {
          status: false,
          statusCode: 200,
          message: 'Please try again later ERRCODE[100]',
        };
      }
    })
    .catch((err: any) => {
      return handleErrorResponse(err);
    });
};

export const httpPatch = async (path: string, body: any, headers: any) => {
  let build_header = await getHeaders(headers);

  const config: AxiosRequestConfig = {
    method: 'patch',
    url: environment.backendUrl + path,
    headers: build_header,
    data: body,
  };

  return await axios(config)
    .then((d: any) => {
      if (d.data) {
        return { statusCode: 200, ...d.data };
      } else {
        return {
          statusCode: 200,
          status: false,
          message: 'Please try again later ERRCODE[100]',
        };
      }
    })
    .catch((err: any) => {
      return handleErrorResponse(err);
    });
};

const handleErrorResponse = (err: any) => {
  console.log(`ERROR RESPONSE FROM PROXY -${err}`);
  let errorData: any = {
    status: false,
    statusCode: 500,
    message: 'please try again later',
  };

  if (err.response.status) {
    errorData['statusCode'] = err.response.status;
  }

  if (err.response.data) {
    let data = err.response.data;
    errorData['message'] = data.message
      ? data.message
      : 'Please try again later ERR0001';
    if (data.detail) {
      errorData['message'] = data.detail.message
        ? data.detail.message
        : 'Please try again later ERR0002';
    }
  }

  return errorData;
};

const getCookie = (cookie: String) => {
  if (cookie) {
    let cookies = cookie.split(';');
    let token = cookies.filter((d: String) => {
      if (d.includes(environment.token)) {
        return d.trim();
      }
      return '';
    });

    if (token.length === 0) {
      return '';
    }

    return token[0] ? token[0].split('=')[1] : '';
  } else {
    return '';
  }
};

const getHeaders = async (headers: any) => {
  let data: any = {};
  if (headers.cookie) {
    const token = await getCookie(headers.cookie);
    data['authorization'] = `Bearer ${token}`;
  }
  if (headers['content-type']) {
    data['content-type'] = headers['content-type'];
  }
  return data;
};

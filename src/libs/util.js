import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title + ' - Home' : '';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'http://localhost/' :
    env === 'production' ?
    '' :
    '';
util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

export default util;
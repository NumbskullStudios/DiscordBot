const fetch = require("node-fetch");
const secret = require('./secret.json');
const config = require('./config.json');

const baseUrl = 'https://api.hacknplan.com/v0';
const projectUrl = `${baseUrl}/projects/${config.hacknplan_project_id}`;
const boardsUrl = `${projectUrl}/boards`;
const designElementsUrl = `${projectUrl}/designelements`;
const milestonesUrl = `${projectUrl}/milestones`;
const categoriesUrl = `${projectUrl}/categories`;
const stagesUrl = `${projectUrl}/stages`;
const tagsUrl = `${projectUrl}/tags`;
const usersUrl = `${projectUrl}/users`;
const workitemsUrl = `${projectUrl}/workitems`;

/**
 * Makes an API call to the HacknPlan servers.
 *
 * @param {string} url The url to send the request to.
 * @param {string} method Which HTTP method to use (GET, POST etc.).
 * @return {JSON} body Body of the request (usually JSON data).
 */
function doRequest(url, method, body = null) {
    return fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'ApiKey ' + secret.hacknplan_api_key
            },
            body: body,
    });
}

function getProject() {
    return doRequest(projectUrl, 'GET');
}

function getTask(id) {
    return doRequest(`${workitemsUrl}/${id}`, 'GET');
}

function getBoard(id) {
    return doRequest(`${boardsUrl}/${id}`, 'GET');
}

function getCurrentBoard() {
    return getProject().then(httpResult => { return httpResult.json(); }).then(projectData => { return getBoard(projectData.defaultBoardId); });
}

function getCategories() {
    return doRequest(categoriesUrl, 'GET');
}

function getMilestone(id) {
    return doRequest(`${milestonesUrl}/${id}`, 'GET');
}

/**
 * Sends a request to HacknPlan to create a task. All that's needed is the task info. The task will go to the backlog.
 * 
 * @param {Object} taskData Javascript data that will be internally JSON stringified
 */
function createTask(taskData){
    return doRequest(workitemsUrl, 'POST', JSON.stringify(taskData));
}

module.exports = {
    doRequest,
    getProject,
    getTask,
    getBoard,
    getCurrentBoard,
    getCategories,
    createTask,
    getMilestone
}
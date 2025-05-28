import { ServiceBase } from "../config/service-base";

export class CandidateService extends ServiceBase {
  getCandidates = async (search, status, page, size) => {
    const params = {};
    if (search) {
      params.search = search;
    }
    if (status) {
      params.status = status;
    }
    params.page = page;
    params.size = size;
    return this.get(`candidate/list`, params);
  };

  getCandidateDetail = async (id) => {
    const params = {};
    params.id = id;
    return this.get(`candidate`, params);
  };

  getCurrentUser = async () => {
    return this.get(`candidate/nameUserLogin`);
  };

  async editCandidate(id, candidateData) {
    const url = `candidate/update?candidateId=${id}`;
    const response = await this.put(url, candidateData);
    return response;
  }

  async createCandidate(candidateData) {
    const response = await this.post(`candidate/create-new`, candidateData);
    return response;
  }

  async createCandidateFromCV(candidateData) {
    const response = await this.post(`candidate/uploadCV`, candidateData);
    return response;
  }

  async uploadCV(fileCV) {
    const formData = new FormData();
    formData.append("fileCV", fileCV);

    return this.post("candidate/uploadCV", formData);
  }

  async banCandidate(id) {
    const url = `candidate/ban?candidateId=${id}`;
    const response = await this.put(url);
    return response;
  }

  async deleteCandidate(id) {
    const url = `candidate/delete?candidateId=${id}`;
    const response = await this.delete(url);
    return response;
  }

  getListMapCandidate = async () => {
    return this.get(`candidate/get-items-to-create-candidate`);
  };
}

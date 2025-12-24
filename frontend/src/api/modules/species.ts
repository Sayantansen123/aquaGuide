import type { SpeciesFormData, AddSpeciesResponse, GetSpeciesManagementResponse, SearchSpeciesParams, GetSearchResponse, SpeciesItem, GetSpeciesDetailResponse } from '@/api/apiTypes';

import httpClient from '@/api/axiosSetup';


export const speciesApi = {
    addSpecies: (data: SpeciesFormData) =>
        httpClient.post<AddSpeciesResponse>('/api/manage_species/species-management/new', data, {
            headers: { useAuth: true },
        }),

    getSpeciesManagement: (page: number = 1) =>
        httpClient.get<GetSpeciesManagementResponse>(`/api/manage_species/species-management?page=${page}`, {
            headers: { useAuth: true },
        }),

    getSpeciesById: (speciesId: string) =>
        httpClient.get<GetSpeciesDetailResponse>(`/api/species/${speciesId}`, { 
            headers: { useAuth: false },
        }),

    updateSpecies: (speciesId: string, data: SpeciesFormData) =>
        httpClient.put<AddSpeciesResponse>(`/api/manage_species/species-management/${speciesId}`, data, {
            headers: { useAuth: true },
        }),

    deleteSpecies: (speciesId: string) =>
        httpClient.delete<{ message: string }>(`/api/manage_species/species-management/${speciesId}`, {
            headers: { useAuth: true },
        }),

    searchSpecies: (params: SearchSpeciesParams) => {
        const queryParams = new URLSearchParams();
        if (params.query) queryParams.append('q', params.query);
        if (params.waterType) queryParams.append('water_type', params.waterType);
        if (params.careLevel) queryParams.append('care_level', params.careLevel);
        if (params.status) queryParams.append('status', params.status);
        if (params.page) queryParams.append('page', params.page.toString());


        return httpClient.get<GetSpeciesManagementResponse>(`/api/species-dictionary?${queryParams.toString()}`, { });
    },
};
// src/hooks/useUsers.ts
import {authApi} from "@/api/modules/auth";
import {useQuery} from "@tanstack/react-query";

export const useUsers = (
	page: number,
	searchQuery: string,
	filters?: {
		role?: string;
		status?: string;
		gender?: string;
		country_code?: string;
		region?: string;
	},
	recentChat?: string
) => {
	const userId = localStorage.getItem("id");

	return useQuery({
		queryKey: ["users", page, searchQuery, filters, recentChat],
		queryFn: () => {
			if (!userId) return;
			if (searchQuery && searchQuery.trim() !== "") {
				return authApi.searchUsersData(page, searchQuery, filters);
			} else if (recentChat === "user") {
			}
			// fallback: should not happen, query is mandatory
			return authApi.getUsersData(page);
		},
		staleTime: 5 * 60 * 1000, // 5 mins
		gcTime: 10 * 60 * 1000, //cache time 10 mins
	});
};

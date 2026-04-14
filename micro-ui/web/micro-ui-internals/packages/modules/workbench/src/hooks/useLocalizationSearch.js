import { useQuery, useMutation } from "react-query";

const useLocalizationSearch = (tenantId, filters, config = {}) => {
  return useQuery(
    ["LOCALIZATION_SEARCH", tenantId, filters],
    async () => {
      const response = await Digit.CustomService.getResponse({
        url: "/localization/messages/v1/_search",
        params: {
          tenantId,
          locale: filters?.locale || "en_IN",
          module: filters?.module || "",
        },
        body: {
          RequestInfo: {
            authToken: Digit.UserService.getUser()?.access_token,
          },
        },
        method: "POST",
      });
      return response;
    },
    {
      enabled: !!tenantId,
      ...config,
    }
  );
};

const useLocalizationCreate = (tenantId) => {
  return useMutation(async (data) => {
    const response = await Digit.CustomService.getResponse({
      url: "/localization/messages/v1/_create",
      body: {
        RequestInfo: {
          authToken: Digit.UserService.getUser()?.access_token,
        },
        tenantId,
        messages: data.messages,
      },
      method: "POST",
    });
    return response;
  });
};

const useLocalizationUpdate = (tenantId) => {
  return useMutation(async (data) => {
    const response = await Digit.CustomService.getResponse({
      url: "/localization/messages/v1/_update",
      body: {
        RequestInfo: {
          authToken: Digit.UserService.getUser()?.access_token,
        },
        tenantId,
        locale: data.locale,
        module: data.module,
        messages: data.messages,
      },
      method: "POST",
    });
    return response;
  });
};

export { useLocalizationSearch, useLocalizationCreate, useLocalizationUpdate };

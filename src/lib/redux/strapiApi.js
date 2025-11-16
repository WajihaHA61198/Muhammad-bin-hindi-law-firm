import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// Helper to get image URL
const getStrapiMedia = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
};

export const strapiApi = createApi({
  reducerPath: "strapiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${STRAPI_URL}/api`,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      if (STRAPI_API_TOKEN) {
        headers.set("Authorization", `Bearer ${STRAPI_API_TOKEN}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "HeroSlides",
    "TeamMembers",
    "Testimonials",
    "Navigation",
    "Services",
    "Subscribers",
  ],
  endpoints: (builder) => ({
    // Hero Slides
    getHeroSlides: builder.query({
      query: () => ({
        url: "/hero-slides",
        params: {
          sort: "order:asc",
          populate: "*",
        },
      }),
      transformResponse: (response) => {
        const items = response.data || [];
        return items.map((item) => {
          const attrs = item.attributes || item;
          return {
            id: item.id,
            documentId: item.documentId,
            title: attrs.Title,
            titleAr: attrs.titleAr,
            description: attrs.description,
            descriptionAr: attrs.descriptionAr,
            cta: attrs.cta,
            ctaAr: attrs.ctaAR,
            ctaUrl: attrs.cta_url || attrs.ctaUrl || "#",
            order: attrs.order,
            image: attrs.image
              ? {
                  ...attrs.image,
                  url: getStrapiMedia(attrs.image.url),
                }
              : null,
            mini_image: attrs.mini_image
              ? {
                  ...attrs.mini_image,
                  url: getStrapiMedia(attrs.mini_image.url),
                }
              : null,
            createdAt: attrs.createdAt,
            updatedAt: attrs.updatedAt,
            publishedAt: attrs.publishedAt,
          };
        });
      },
      providesTags: ["HeroSlides"],
    }),

    // Team Members
    getTeamMembers: builder.query({
      query: () => ({
        url: "/team-members",
        params: {
          sort: "order:asc",
          populate: "*",
        },
      }),
      transformResponse: (response) => {
        const items = response.data || [];
        return items.map((item) => {
          const attrs = item.attributes || item;
          return {
            id: item.id,
            documentId: item.documentId,
            name: attrs.name,
            nameAr: attrs.nameAr,
            position: attrs.position,
            positionAr: attrs.positionAr,
            email: attrs.email,
            phone: attrs.phone,
            whatsapp: attrs.whatsapp,
            bio: attrs.bio,
            bioAr: attrs.bioAr,
            order: attrs.order,
            isActive: attrs.isActive,
            image: attrs.image
              ? {
                  ...attrs.image,
                  url: getStrapiMedia(attrs.image.url),
                }
              : null,
            createdAt: attrs.createdAt,
            updatedAt: attrs.updatedAt,
            publishedAt: attrs.publishedAt,
          };
        });
      },
      providesTags: ["TeamMembers"],
    }),

    // Testimonials
    getTestimonials: builder.query({
      query: () => ({
        url: "/testimonials",
        params: {
          sort: "order:asc",
          populate: "*",
        },
      }),
      transformResponse: (response) => {
        const items = response.data || [];
        return items.map((item) => {
          const attrs = item.attributes || item;
          return {
            id: item.id,
            documentId: item.documentId,
            text: attrs.text,
            textAr: attrs.textAr,
            author: attrs.author,
            authorAr: attrs.authorAr,
            role: attrs.role,
            roleAr: attrs.roleAr,
            order: attrs.order,
            isActive: attrs.isActive,
            image: attrs.image
              ? {
                  ...attrs.image,
                  url: getStrapiMedia(attrs.image.url),
                }
              : null,
            createdAt: attrs.createdAt,
            updatedAt: attrs.updatedAt,
            publishedAt: attrs.publishedAt,
          };
        });
      },
      providesTags: ["Testimonials"],
    }),

    // Navigation
    getNavigation: builder.query({
      query: (locale = "en") => ({
        url: "/navigation",
        params: {
          locale,
          populate: "logo",
        },
      }),
      transformResponse: (response) => {
        const data = response.data || {};
        const attrs = data.attributes || data;

        return {
          id: data.id,
          documentId: data.documentId,
          title: attrs.title || "LOGO",
          url: attrs.url || "/",
          logo: attrs.logo
            ? {
                id: attrs.logo.id,
                url: getStrapiMedia(attrs.logo.url),
                alternativeText: attrs.logo.alternativeText || attrs.title,
                width: attrs.logo.width,
                height: attrs.logo.height,
              }
            : null,
          createdAt: attrs.createdAt,
          updatedAt: attrs.updatedAt,
          publishedAt: attrs.publishedAt,
          locale: attrs.locale || locale,
        };
      },
      providesTags: ["Navigation"],
    }),

    // Services (All)
    getServices: builder.query({
      query: () => ({
        url: "/services",
        params: {
          populate: "*",
          sort: ["order:asc"],
          pagination: {
            pageSize: 100,
          },
        },
      }),
      transformResponse: (response) => {
        const items = response.data || [];
        return items.map((item) => {
          const attrs = item.attributes || item;
          return {
            id: item.id,
            documentId: item.documentId,
            title: attrs.title,
            titleAr: attrs.titleAr,
            slug: attrs.slug,
            description: attrs.description,
            descriptionAr: attrs.descriptionAr,
            order: attrs.order,
            category: attrs.category || "General",
            image: attrs.image
              ? {
                  ...attrs.image,
                  url: getStrapiMedia(attrs.image.url),
                }
              : null,
            createdAt: attrs.createdAt,
            updatedAt: attrs.updatedAt,
            publishedAt: attrs.publishedAt,
          };
        });
      },
      providesTags: ["Services"],
    }),

    // Services (Paginated)
    getServicesPaginated: builder.query({
      query: ({
        page = 1,
        pageSize = 9,
        category = null,
        sort = "order:asc",
      }) => {
        const params = {
          populate: "*",
          pagination: { page, pageSize },
          sort: [sort],
        };

        if (category && category !== "All") {
          params.filters = {
            category: { $eq: category },
          };
        }

        return { url: "/services", params };
      },
      transformResponse: (response) => {
        const items = response.data || [];
        const pagination = response.meta?.pagination || {
          page: 1,
          pageSize: 9,
          pageCount: 1,
          total: 0,
        };

        const formattedData = items.map((item) => {
          const attrs = item.attributes || item;
          return {
            id: item.id,
            documentId: item.documentId,
            title: attrs.title,
            titleAr: attrs.titleAr,
            slug: attrs.slug,
            description: attrs.description,
            descriptionAr: attrs.descriptionAr,
            order: attrs.order,
            category: attrs.category || "General",
            image: attrs.image
              ? {
                  ...attrs.image,
                  url: getStrapiMedia(attrs.image.url),
                }
              : null,
            createdAt: attrs.createdAt,
            updatedAt: attrs.updatedAt,
            publishedAt: attrs.publishedAt,
          };
        });

        return { data: formattedData, pagination };
      },
      providesTags: ["Services"],
    }),

    // Service by Slug
    getServiceBySlug: builder.query({
      query: (slug) => ({
        url: "/services",
        params: {
          filters: {
            slug: { $eqi: slug },
          },
          populate: "*",
        },
      }),
      transformResponse: (response) => {
        const items = response.data || [];
        if (items.length === 0) return null;

        const item = items[0];
        const data = item.attributes || item;

        return {
          id: item.id,
          documentId: item.documentId,
          title: data.title,
          titleAr: data.titleAr || data.title,
          slug: data.slug,
          description: data.description || [],
          description2: data.description2 || [],
          descriptionAr: data.descriptionAr || [],
          order: data.order || 0,
          category: data.category || "General",
          image: data.image
            ? {
                ...data.image,
                url: getStrapiMedia(data.image.url),
              }
            : null,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          publishedAt: data.publishedAt,
        };
      },
      providesTags: (result, error, slug) => [{ type: "Services", id: slug }],
    }),

    // Newsletter Subscription
    subscribeToNewsletter: builder.mutation({
      query: ({ email }) => ({
        url: "/subscribers",
        method: "POST",
        body: {
          data: {
            email: email.toLowerCase().trim(),
          },
        },
      }),
      transformResponse: (response) => {
        const data = response.data || {};
        const attrs = data.attributes || data;

        return {
          success: true,
          data: {
            id: data.id,
            documentId: data.documentId,
            email: attrs.email,
            createdAt: attrs.createdAt,
            updatedAt: attrs.updatedAt,
            publishedAt: attrs.publishedAt,
          },
          message: "Successfully subscribed to newsletter",
        };
      },
      transformErrorResponse: (response) => {
        if (response.status === 400) {
          return {
            success: false,
            error: "EMAIL_ALREADY_EXISTS",
            message: "This email is already subscribed",
          };
        }
        return {
          success: false,
          error: "SUBSCRIPTION_FAILED",
          message: "Subscription failed. Please try again.",
        };
      },
      invalidatesTags: ["Subscribers"],
    }),
  }),
});

export const {
  useGetHeroSlidesQuery,
  useGetTeamMembersQuery,
  useGetTestimonialsQuery,
  useGetNavigationQuery,
  useGetServicesQuery,
  useGetServicesPaginatedQuery,
  useGetServiceBySlugQuery,
  useSubscribeToNewsletterMutation,
} = strapiApi;

// Export helper function
export { getStrapiMedia };

import axios from "axios";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "https://humble-nature-e17034c032.strapiapp.com";
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// console.log("Strapi URL:", STRAPI_URL);
// console.log("Strapi Token exists:", !!STRAPI_API_TOKEN);

const strapiApi = axios.create({
  baseURL: `${STRAPI_URL}`,
  headers: {
    "Content-Type": "application/json",
    ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
  },
});

// Add request interceptor for debugging
strapiApi.interceptors.request.use(
  (config) => {
    // console.log("Making request to:", config.url);
    // console.log("Full URL:", `${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
strapiApi.interceptors.response.use(
  (response) => {
    // console.log("Response received:", response.data);
    return response;
  },
  (error) => {
    // console.error("Response error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Optional: Keep your debug interceptors
strapiApi.interceptors.request.use((config) => {
  // console.log("Request →", config.baseURL + config.url);
  return config;
});

// Helper to get image URL
export const getStrapiMedia = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
};

// Fetch hero slides
export const getHeroSlides = async () => {
  try {
    // console.log("Fetching hero slides...");
    const response = await strapiApi.get("/api/hero-slides", {
      params: {
        sort: "order:asc",
        populate: "*",
      },
    });

    const items = response.data.data || []; // FIXED: Uncommented this line
    // console.log("Raw response items:", items);

    const formattedData = items.map((item) => {
      // console.log("Processing item:", item);
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
        image: attrs.image,
        mini_image: attrs.mini_image,
        createdAt: attrs.createdAt,
        updatedAt: attrs.updatedAt,
        publishedAt: attrs.publishedAt,
      };
    });
    // console.log("Formatted data:", formattedData);
    return formattedData;
  } catch (error) {
    console.error("Error fetching hero slides:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);

    // Return empty array on error
    return [];
  }
};

// Fetch Team members
export const getTeamMembers = async () => {
  try {
    // console.log("Fetching team members...");
    const response = await strapiApi.get("/api/team-members", {
      params: {
        sort: "order:asc",
        populate: "*",
      },
    });

    const items = response.data.data || [];
    // console.log("Raw team members response:", items);

    const formattedData = items.map((item) => {
      // console.log("Processing team member:", item);
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
        image: attrs.image,
        createdAt: attrs.createdAt,
        updatedAt: attrs.updatedAt,
        publishedAt: attrs.publishedAt,
      };
    });

    // console.log("Formatted team members:", formattedData);
    return formattedData;
  } catch (error) {
    console.error("Error fetching team members:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);

    // Return empty array on error
    return [];
  }
};

// Fetch Testimonials
export const getTestimonials = async () => {
  try {
    // console.log("Fetching testimonials...");
    const response = await strapiApi.get("/api/testimonials", {
      params: {
        sort: "order:asc",
        populate: "*",
      },
    });

    const items = response.data.data || [];
    // console.log("Raw testimonials response:", items);

    const formattedData = items.map((item) => {
      // console.log("Processing testimonial:", item);
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
        image: attrs.image,
        createdAt: attrs.createdAt,
        updatedAt: attrs.updatedAt,
        publishedAt: attrs.publishedAt,
      };
    });

    // console.log("Formatted testimonials:", formattedData);
    return formattedData;
  } catch (error) {
    console.error("Error fetching testimonials:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);

    return [];
  }
};

// NAVIGATION (Single Type)
export const getNavigation = async (locale = "en") => {
  try {
    // console.log("Fetching navigation...");
    const response = await strapiApi.get("/api/navigation", {
      params: {
        locale: locale,
        populate: "logo",
      },
    });

    const data = response.data.data || {};
    // console.log("Raw navigation response:", data);

    const attrs = data.attributes || data;

    const formattedData = {
      id: data.id,
      documentId: data.documentId,
      title: attrs.title || "LOGO",
      titleAr: attrs.titleAr || "LOGO",
      url: attrs.url || "/",

      // Logo - handles both nested and flat structures
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

    // console.log("Formatted navigation:", formattedData);
    return formattedData;
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return {
      id: null,
      documentId: null,
      title: "LOGO",
      url: "/",
      logo: null,
    };
  }
};

// NEWSLETTER SUBSCRIPTION
export const subscribeToNewsletter = async ({ email, language = "en" }) => {
  try {
    // console.log("Subscribing email:", email);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Step 1: Check if email already exists
    try {
      const existingResponse = await strapiApi.get("/api/subscribers", {
        params: {
          filters: {
            email: {
              $eq: normalizedEmail,
            },
          },
        },
      });

      const existingSubscribers = existingResponse.data.data || [];

      if (existingSubscribers.length > 0) {
        console.warn("Email already subscribed:", normalizedEmail);
        throw new Error("EMAIL_ALREADY_EXISTS");
      }
    } catch (checkError) {
      // Re-throw if it's our custom error
      if (checkError.message === "EMAIL_ALREADY_EXISTS") {
        throw checkError;
      }

      // If we can't check (no read permission), we'll try to create anyway
      console.warn("Could not check existing subscribers:", checkError.message);
    }

    // Step 2: Create new subscriber - CORRECTED PAYLOAD
    const response = await strapiApi.post("/subscribers", {
      data: {
        email: normalizedEmail,
        // Remove language and other fields if not in your Strapi schema
        // Only include fields that exist in your Subscriber content type
      },
    });

    const data = response.data.data || {};
    console.log("Subscription successful:", data);

    const attrs = data.attributes || data;

    const formattedData = {
      id: data.id,
      documentId: data.documentId,
      email: attrs.email,
      createdAt: attrs.createdAt,
      updatedAt: attrs.updatedAt,
      publishedAt: attrs.publishedAt,
    };

    // console.log("Formatted subscription data:", formattedData);
    return {
      success: true,
      data: formattedData,
      message: "Successfully subscribed to newsletter",
    };
  } catch (error) {
    console.error("Error subscribing to newsletter:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);

    // Handle duplicate email error
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return {
        success: false,
        error: "EMAIL_ALREADY_EXISTS",
        message: "This email is already subscribed",
      };
    }

    // Handle Strapi validation errors
    if (error.response?.status === 400) {
      const strapiError = error.response?.data?.error;

      // Check if it's a unique constraint violation
      if (
        strapiError?.message?.includes("unique") ||
        strapiError?.message?.includes("duplicate") ||
        strapiError?.details?.errors?.some((e) => e.path?.includes("email"))
      ) {
        return {
          success: false,
          error: "EMAIL_ALREADY_EXISTS",
          message: "This email is already subscribed",
        };
      }

      return {
        success: false,
        error: "VALIDATION_ERROR",
        message: strapiError?.message || "Invalid subscription data",
      };
    }

    // Handle network/server errors
    if (error.response?.status >= 500) {
      return {
        success: false,
        error: "SERVER_ERROR",
        message: "Server error. Please try again later.",
      };
    }

    // Generic error
    return {
      success: false,
      error: "SUBSCRIPTION_FAILED",
      message:
        error.response?.data?.error?.message ||
        error.message ||
        "Subscription failed. Please try again.",
    };
  }
};

// SERVICES
// ============================================
// export const getServices = async () => {
//   try {
//     console.log("Fetching services...");
//     const response = await strapiApi.get("/services", {
//       params: {
//         sort: "order:asc",
//         populate: "*",
//       },
//     });

//     const items = response.data.data || [];
//     console.log("Raw services response:", items);

//     const formattedData = items.map((item) => {
//       const attrs = item.attributes || item;

//       return {
//         id: item.id,
//         documentId: item.documentId,
//         title: attrs.title,
//         titleAr: attrs.titleAr,
//         slug: attrs.slug || "#",
//         description: attrs.description,
//         descriptionAr: attrs.descriptionAr,
//         order: attrs.order,
//         category: attrs.category || "General",
//         createdAt: attrs.createdAt,
//         updatedAt: attrs.updatedAt,
//         publishedAt: attrs.publishedAt,
//       };
//     });

//     console.log("Formatted services:", formattedData);
//     return formattedData;
//   } catch (error) {
//     console.error("Error fetching services:");
//     console.error("Status:", error.response?.status);
//     console.error("Data:", error.response?.data);
//     console.error("Message:", error.message);

//     return [];
//   }
// };

// Get single service by slug
// export const getServiceBySlug = async (slug) => {
//   try {
//     console.log("Fetching service by slug:", slug);
//     const response = await strapiApi.get("/services", {
//       params: {
//         filters: {
//           slug: {
//             $eq: slug,
//           },
//         },
//         populate: "*",
//       },
//     });

//     const items = response.data.data || [];

//     if (items.length === 0) {
//       console.log("No service found with slug:", slug);
//       return null;
//     }

//     const item = items[0];
//     const attrs = item.attributes || item;

//     const formattedData = {
//       id: item.id,
//       documentId: item.documentId,
//       title: attrs.title,
//       titleAr: attrs.titleAr,
//       slug: attrs.slug || "#",
//       description: attrs.description,
//       descriptionAr: attrs.descriptionAr,
//       order: attrs.order,
//       category: attrs.category || "General",
//       createdAt: attrs.createdAt,
//       updatedAt: attrs.updatedAt,
//       publishedAt: attrs.publishedAt,
//     };

//     console.log("Formatted service:", formattedData);
//     return formattedData;
//   } catch (error) {
//     console.error("Error fetching service by slug:");
//     console.error("Status:", error.response?.status);
//     console.error("Data:", error.response?.data);
//     console.error("Message:", error.message);

//     return null;
//   }
// };

// ──────────────────────────────────────────────────────────────
// SERVICES API WITH PAGINATION
// ──────────────────────────────────────────────────────────────

export const getServicesPaginated = async (options = {}) => {
  try {
    const {
      page = 1,
      pageSize = 9,
      category = null,
      sort = "order:asc",
    } = options;

    // console.log("Fetching paginated services:", {
    //   page,
    //   pageSize,
    //   category,
    //   sort,
    // });

    const params = {
      populate: "*",
      pagination: {
        page,
        pageSize,
      },
      sort: [sort],
    };

    // Add category filter if provided
    if (category && category !== "All") {
      params.filters = {
        category: {
          $eq: category,
        },
      };
    }

    const response = await strapiApi.get("/api/services", { params });

    // console.log("Services response:", response.data);

    const items = response.data.data || [];
    const pagination = response.data.meta?.pagination || {
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
        createdAt: attrs.createdAt,
        updatedAt: attrs.updatedAt,
        publishedAt: attrs.publishedAt,
      };
    });

    // console.log("Formatted paginated services:", {
    //   data: formattedData,
    //   pagination,
    // });

    return {
      data: formattedData,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        pageCount: pagination.pageCount,
        total: pagination.total,
      },
    };
  } catch (error) {
    console.error("Error fetching paginated services:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);

    return {
      data: [],
      pagination: {
        page: 1,
        pageSize: 9,
        pageCount: 0,
        total: 0,
      },
    };
  }
};

export const getServices = async () => {
  try {
    // console.log("Fetching all services...");
    const response = await strapiApi.get("/api/services", {
      params: {
        populate: "*",
        sort: ["order:asc"],
        pagination: {
          pageSize: 100, // Get all services (adjust if you have more)
        },
      },
    });

    // console.log("Services response:", response.data);

    const items = response.data.data || [];

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
        createdAt: attrs.createdAt,
        updatedAt: attrs.updatedAt,
        publishedAt: attrs.publishedAt,
      };
    });

    // console.log("Formatted services:", formattedData);
    return formattedData;
  } catch (error) {
    // console.error("Error fetching services:");
    // console.error("Status:", error.response?.status);
    // console.error("Data:", error.response?.data);
    // console.error("Message:", error.message);

    return [];
  }
};
// export const getServiceBySlug = async (slug) => {
//   try {
//     console.log("Fetching service by slug:", slug);
//     const response = await strapiApi.get("/services", {
//       params: {
//         filters: {
//           slug: {
//             $eq: slug,
//           },
//         },
//         populate: "*",
//       },
//     });

//     console.log("Service response:", response.data);

//     const items = response.data.data || [];

//     if (items.length === 0) {
//       console.log("No service found with slug:", slug);
//       return null;
//     }

//     const item = items[0];
//     const attrs = item.attributes || item;

//     const formattedData = {
//       id: item.id,
//       documentId: item.documentId,
//       title: attrs.title,
//       titleAr: attrs.titleAr,
//       slug: attrs.slug,
//       description: attrs.description,
//       descriptionAr: attrs.descriptionAr,
//       order: attrs.order,
//       category: attrs.category || "General",
//       createdAt: attrs.createdAt,
//       updatedAt: attrs.updatedAt,
//       publishedAt: attrs.publishedAt,
//     };

//     console.log("Formatted service:", formattedData);
//     return formattedData;
//   } catch (error) {
//     console.error("Error fetching service by slug:");
//     console.error("Status:", error.response?.status);
//     console.error("Data:", error.response?.data);
//     console.error("Message:", error.message);

//     return null;
//   }
// };

// export const getServiceBySlug = async (slug, locale = "en") => {
//   try {
//     console.log("Fetching service by slug:", slug, "locale:", locale);

//     const response = await strapiApi.get("/services", {
//       params: {
//         // locale,
//         filters: {
//           slug: {
//             $eq: slug,
//           },
//         },
//         populate: "*",
//       },
//     });

//     console.log("Service response:", response.data);

//     const items = response.data.data || [];

//     if (items.length === 0) {
//       console.log("No service found with slug:", slug);
//       return null;
//     }

//     const item = items[0];
//     const attrs = item.attributes || item;

//     const formattedData = {
//       id: item.id,
//       documentId: item.documentId,
//       title: attrs.title,
//       titleAr: attrs.titleAr,
//       slug: attrs.slug,
//       description: attrs.description,
//       descriptionAr: attrs.descriptionAr,
//       order: attrs.order,
//       category: attrs.category || "General",
//       image: attrs.image, // Include image data
//       createdAt: attrs.createdAt,
//       updatedAt: attrs.updatedAt,
//       publishedAt: attrs.publishedAt,
//     };

//     console.log("Formatted service:", formattedData);
//     return formattedData;
//   } catch (error) {
//     console.error("Error fetching service by slug:");
//     console.error("Status:", error.response?.status);
//     console.error("Data:", error.response?.data);
//     console.error("Message:", error.message);

//     return null;
//   }
// };

// export const getServiceBySlug = async (slug, locale = "en") => {
//   if (!slug) return null;

//   try {
//     const response = await strapiApi.get("/services", {
//       params: {
//         locale,
//         "filters[slug][$eq]": slug, // <-- make sure the filter key is correct
//         populate: "*",
//       },
//     });

//     const items = response.data.data || [];

//     if (!items.length) return null;

//     const item = items[0];

//     return {
//       id: item.id,
//       title: item.attributes.title,
//       titleAr: item.attributes.titleAr,
//       slug: item.attributes.slug,
//       description: item.attributes.description,
//       descriptionAr: item.attributes.descriptionAr,
//       order: item.attributes.order,
//       category: item.attributes.category,
//       image: item.attributes.image,
//     };
//   } catch (error) {
//     console.error("Error fetching service by slug:", error);
//     return null;
//   }
// };

// export const getServiceCategories = async () => {
//   try {
//     // console.log("Fetching service categories...");
//     const services = await getServices();

//     const categories = [...new Set(services.map((s) => s.category))];
//     // console.log("Service categories:", categories);

//     return categories;
//   } catch (error) {
//     // console.error("Error fetching service categories:", error);
//     return [];
//   }
// };

// lib/strapi.js
// Remove ALL getServiceBySlug functions and keep ONLY this one:

// utils/strapi.js or wherever you keep it
// export const getServiceBySlug = async (slug) => {
//   try {
//     console.log("\nFetching service with slug:", slug);

//     const response = await strapiApi.get("/services", {
//       params: {
//         // Correct Strapi v4 filter syntax
//         "filters[slug][$eqi]": slug,
//         // Or case-sensitive: "filters[slug][$eq]": slug,
//         populate: "*",
//       },
//       paramsSerializer: (params) => {
//         // Important: Use 'qs' library or custom serializer for proper array/object handling
//         return Object.keys(params)
//           .map((key) => {
//             const value = params[key];
//             if (value === undefined || value === null) return "";
//             return `${key}=${encodeURIComponent(value)}`;
//           })
//           .filter(Boolean)
//           .join("&");
//       },
//     });

//     const items = response.data.data || [];

//     console.log(`Found ${items.length} service(s) with slug: ${slug}`);

//     if (items.length === 0) {
//       console.log("No service found. Available slugs:");

//       // Debug: List all services
//       const all = await strapiApi.get("/services", { params: { "fields[0]": "slug,title" } });
//       all.data.data.forEach((s) => {
//         console.log(`  → "${s.attributes.slug}" | ${s.attributes.title}`);
//       });

//       return null;
//     }

//     const item = items[0].attributes;

//     const service = {
//       id: items[0].id,
//       documentId: items[0].documentId,
//       title: item.title,
//       titleAr: item.titleAr || item.title,
//       slug: item.slug,
//       description: item.description || [],
//       descriptionAr: item.descriptionAr || item.description || [],
//       order: item.order || 0,
//       category: item.category || "General",
//       createdAt: item.createdAt,
//       updatedAt: item.updatedAt,
//       publishedAt: item.publishedAt,
//     };

//     console.log("Service loaded successfully:", service.title);
//     return service;

//   } catch (error) {
//     console.error("Failed to fetch service:", slug);
//     if (error.response) {
//       console.error("Status:", error.response.status);
//       console.error("Data:", error.response.data);
//     } else {
//       console.error("Error:", error.message);
//     }
//     return null;
//   }
// };

// / ──────────────────────────────────────────────────────────────
// THIS IS THE ONLY WORKING getServiceBySlug YOU NEED
// ──────────────────────────────────────────────────────────────
// lib/strapi.js (or wherever you have it)

export const getServiceBySlug = async (slug) => {
  if (!slug) {
    console.log("❌ No slug provided");
    return null;
  }

  try {
    console.log("\n========== FETCHING SERVICE ==========");
    console.log("Slug:", slug);

    const response = await strapiApi.get("/api/services", {
      params: {
        filters: {
          slug: {
            $eqi: slug,
          },
        },
        populate: "*",
      },
    });

    console.log("Response Status:", response.status);

    const items = response.data?.data || [];
    console.log("Items found:", items.length);

    if (items.length === 0) {
      console.log("❌ No service found");

      // Debug: Show all available services
      const allResponse = await strapiApi.get("/api/services?populate=*");
      console.log("\n📋 Available services:");
      allResponse.data.data.forEach((s, i) => {
        // Try both structures
        const slug = s.attributes?.slug || s.slug;
        const title = s.attributes?.title || s.title;
        console.log(`${i + 1}. Slug: "${slug}" | Title: "${title}"`);
      });

      return null;
    }

    const item = items[0];
    console.log("\n✅ Service found!");
    console.log("Item structure check:");
    console.log("- Has attributes:", !!item.attributes);
    console.log("- Has direct title:", !!item.title);

    // ✅ Handle BOTH structures: with attributes OR direct
    const data = item.attributes || item;

    console.log("Using data from:", item.attributes ? "attributes" : "direct");
    console.log("Title:", data.title);
    console.log(
      "Description type:",
      Array.isArray(data.description) ? "Array" : typeof data.description
    );

    const formattedData = {
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
      image: data.image,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      publishedAt: data.publishedAt,
    };

    console.log("\n📦 Formatted Data:");
    console.log("- Title:", formattedData.title);
    console.log("- Slug:", formattedData.slug);
    console.log(
      "- Description length:",
      formattedData.description?.length || 0
    );
    console.log("========================================\n");

    return formattedData;
  } catch (error) {
    console.error("\n❌ ERROR FETCHING SERVICE");
    console.error("Message:", error.message);
    console.error("Status:", error.response?.status);
    return null;
  }
};

// Keep your working getServices (for navbar dropdown)
// ──────────────────────────────────────────────────────────────
export const getService = async () => {
  try {
    const response = await strapiApi.get("/api/services?populate=*&sort=order:asc");
    const items = response.data?.data || [];

    return items.map((item) => {
      const a = item.attributes;
      return {
        id: item.id,
        title: a.title,
        titleAr: a.titleAr || a.title,
        slug: a.slug,
        order: a.order || 0,
      };
    });
  } catch (error) {
    console.error("Error fetching services list:", error.message);
    return [];
  }
};
// export const getAllServices = async () => {
//   try {
//     const response = await strapiApi.get("/services", {
//       params: { populate: "*" },
//     });

//     return response.data.data.map((item) => ({
//       id: item.id,
//       slug: item.attributes.slug,
//       title: item.attributes.title,
//     }));
//   } catch (error) {
//     console.error("Error fetching all services:", error);
//     return [];
//   }
// };

export default strapiApi;

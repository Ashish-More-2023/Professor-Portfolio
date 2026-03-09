import AdminJS from 'adminjs';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';

// Register the adapter FIRST
AdminJS.registerAdapter({ Database, Resource });

// Then instantiate Prisma
export const prisma = new PrismaClient();

// Resource configurations
export const resources = [
  {
    resource: { 
      model: getModelByName('Hero'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Content Management', icon: 'Home' },
      properties: {
        profileImage: {
          type: 'string',
          description: '📸 Upload image at http://localhost:5000/upload.html then paste the URL here',
        },
        name: {
          type: 'string',
        },
        designation: {
          type: 'string',
        },
        departments: {
          type: 'textarea',
          description: 'Enter departments separated by commas'
        },
        office: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        phone: {
          type: 'string',
        },
        fax: {
          type: 'string',
        },
        websiteUrl: {
          type: 'string',
        },
        researchAreas: {
          type: 'textarea',
          description: 'Enter research areas separated by commas'
        },
        createdAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        updatedAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('About'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Content Management', icon: 'InfoCircle' },
      properties: {
        title: {
          type: 'string',
        },
        content: {
          type: 'textarea',
          props: {
            rows: 10
          }
        },
        createdAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        updatedAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('Research'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Research', icon: 'Science' },
      sort: {
        sortBy: 'order',
        direction: 'asc'
      },
      actions: {
        new: {
          before: async (request) => {
            if (request.payload?.description !== undefined) {
              request.payload.description = String(request.payload.description).trim();
            }
            return request;
          }
        },
        edit: {
          before: async (request) => {
            if (request.payload?.description !== undefined) {
              request.payload.description = String(request.payload.description).trim();
            }
            return request;
          }
        }
      },
      properties: {
        title: {
          type: 'string',
        },
        description: {
          type: 'textarea',
          props: {
            rows: 6
          }
        },
        imageUrl: {
          type: 'string',
          description: '📸 Upload image at http://localhost:5000/upload.html then paste the URL here',
        },
        order: {
          type: 'number',
          description: 'Lower numbers appear first (0, 1, 2, 3...)'
        },
        isVisible: {
          type: 'boolean',
          description: 'Toggle to show/hide on website'
        },
        createdAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        updatedAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('ResearchPublication'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Research', icon: 'Document' },
      sort: {
        sortBy: 'order',
        direction: 'asc'
      },
      properties: {
        researchId: {
          isVisible: { list: true, filter: true, show: true, edit: true },
        },
        title: {
          type: 'textarea',
        },
        authors: {
          type: 'textarea',
        },
        journal: {
          type: 'string',
        },
        year: {
          type: 'number',
        },
        doi: {
          type: 'string',
        },
        order: {
          type: 'number',
          description: 'Lower numbers appear first within each research area'
        },
        createdAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        updatedAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('Publication'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Content Management', icon: 'FileText' },
      sort: {
        sortBy: 'year',
        direction: 'desc'
      },
      properties: {
        title: {
          type: 'textarea',
        },
        authors: {
          type: 'textarea',
        },
        venue: {
          type: 'string',
        },
        year: {
          type: 'number',
        },
        doi: {
          type: 'string',
        },
        publisher: {
          type: 'string',
        },
        order: {
          type: 'number',
          description: 'Lower numbers appear first (0, 1, 2, 3...)'
        },
        isVisible: {
          type: 'boolean',
          description: 'Toggle to show/hide on website'
        },
        createdAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        updatedAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        }
      }
    }
  },
  // NEW: PublicationPage for bulk uploads (100+ publications)
  {
    resource: { 
      model: getModelByName('PublicationPage'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Publications & Books', icon: 'DocumentText' },
      sort: {
        sortBy: 'year',
        direction: 'desc'
      },
      properties: {
        title: {
          type: 'textarea',
          description: 'Publication title'
        },
        authors: {
          type: 'textarea',
          description: 'Authors (comma-separated)'
        },
        venue: {
          type: 'string',
          description: 'Journal or Conference name'
        },
        year: {
          type: 'number',
          description: 'Publication year'
        },
        doi: {
          type: 'string',
          description: 'DOI number'
        },
        publisher: {
          type: 'string',
          description: 'Publisher name'
        },
        order: {
          type: 'number',
          description: 'Display order (0, 1, 2, 3...)'
        },
        isVisible: {
          type: 'boolean',
          description: 'Show/hide on website'
        },
        createdAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        updatedAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        }
      },
      listProperties: ['title', 'year', 'venue', 'isVisible', 'order'],
      filterProperties: ['year', 'venue', 'isVisible'],
    }
  },
  {
    resource: { 
      model: getModelByName('News'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Content Management', icon: 'Newspaper' },
      sort: {
        sortBy: 'order',
        direction: 'asc'
      },
      properties: {
        date: {
          type: 'string',
          description: 'Format: YYYY-MM-DD (e.g., 2024-11-26)'
        },
        text: {
          type: 'textarea',
        },
        link: {
          type: 'string',
        },
        summary: {
          type: 'textarea',
        },
        order: {
          type: 'number',
          description: 'Lower numbers appear first (0, 1, 2, 3...)'
        },
        isVisible: {
          type: 'boolean',
          description: 'Toggle to show/hide on website'
        },
        createdAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        updatedAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('TeachingDepartment'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Teaching', icon: 'Education' },
      sort: {
        sortBy: 'order',
        direction: 'asc'
      },
      properties: {
        name: {
          type: 'string',
          description: 'Full department name'
        },
        color: {
          type: 'string',
          description: 'Tailwind color name (emerald, sky, blue, teal, purple, etc.)'
        },
        order: {
          type: 'number',
          description: 'Lower numbers appear first (0, 1, 2, 3...)'
        },
        isVisible: {
          type: 'boolean',
          description: 'Toggle to show/hide on website'
        },
        createdAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        updatedAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('TeachingCourse'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Teaching', icon: 'Book' },
      sort: {
        sortBy: 'order',
        direction: 'asc'
      },
      properties: {
        departmentId: {
          isVisible: { list: true, filter: true, show: true, edit: true },
        },
        courseCode: {
          type: 'string',
          description: 'e.g., BT 205, DA 461'
        },
        courseName: {
          type: 'string',
          description: 'e.g., Biophysics, Bioinformatics'
        },
        courseType: {
          type: 'string',
          availableValues: [
            { value: 'Undergraduate', label: 'Undergraduate' },
            { value: 'Graduate', label: 'Graduate' },
            { value: 'Other', label: 'Other' }
          ],
        },
        order: {
          type: 'number',
          description: 'Lower numbers appear first within each department'
        },
        createdAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        updatedAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        }
      }
    }
  },
  // Resume Profile
  {
    resource: { 
      model: getModelByName('ResumeProfile'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Resume', icon: 'DocumentText' },
      properties: {
        name: { type: 'string' },
        title: { type: 'string' },
        departments: {
          type: 'textarea',
          description: 'Enter departments separated by commas'
        },
        profileImage: {
          type: 'string',
          description: '📸 Upload at http://localhost:5000/upload.html'
        },
        email: { type: 'string' },
        phone: { type: 'string' },
        websiteUrl: { type: 'string' },
        resumePDF: {
          type: 'string',
          description: 'URL to PDF file'
        },
        createdAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        updatedAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('Education'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Resume', icon: 'AcademicCap' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        degree: { type: 'string' },
        field: { type: 'string' },
        institution: { type: 'string' },
        year: { type: 'string', description: 'e.g., 1999 - 2004' },
        order: { type: 'number', description: 'Lower appears first' },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('Position'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Resume', icon: 'Briefcase' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        title: { type: 'string' },
        place: { type: 'string' },
        years: { type: 'string', description: 'e.g., 2019 - present' },
        order: { type: 'number', description: 'Lower appears first' },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('ResearchInterest'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Resume', icon: 'LightBulb' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        interest: { type: 'string' },
        order: { type: 'number', description: 'Lower appears first' },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('Award'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Resume', icon: 'Star' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        title: { type: 'textarea' },
        order: { type: 'number', description: 'Lower appears first' },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('Editorial'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Resume', icon: 'Newspaper' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        journalTitle: { type: 'string' },
        publisher: { type: 'string' },
        since: { type: 'string', description: 'e.g., 2018 onwards' },
        impactFactor: { type: 'string' },
        journalImage: {
          type: 'string',
          description: '📸 Upload at http://localhost:5000/upload.html'
        },
        order: { type: 'number', description: 'Lower appears first' },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('Patent'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Patents & Tools', icon: 'LightningBolt' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        title: { type: 'textarea' },
        inventors: { type: 'textarea' },
        patentNo: { type: 'string' },
        date: { type: 'string', description: 'Format: DD.MM.YYYY or leave empty' },
        status: {
          type: 'string',
          availableValues: [
            { value: 'Published', label: 'Published' },
            { value: 'Filed', label: 'Filed' },
            { value: 'Granted', label: 'Granted' },
            { value: 'Awarded', label: 'Awarded' }
          ]
        },
        patentType: {
          type: 'string',
          availableValues: [
            { value: 'Indian', label: 'Indian' },
            { value: 'International', label: 'International' }
          ]
        },
        order: { type: 'number', description: 'Lower appears first' },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  // Lab Profile (PI)
  {
    resource: { 
      model: getModelByName('LabProfile'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'MID Lab', icon: 'Science' },
      properties: {
        name: { type: 'string' },
        title: { type: 'string', description: 'e.g., Principal Investigator' },
        photo: {
          type: 'string',
          description: '📸 Upload at http://localhost:5000/upload.html'
        },
        description: {
          type: 'textarea',
          props: { rows: 6 }
        },
        email: { type: 'string' },
        url: { type: 'string', description: 'Faculty page URL' },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('LabCarouselImage'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'MID Lab', icon: 'Photograph' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        imageUrl: {
          type: 'string',
          description: '📸 Upload at http://localhost:5000/upload.html'
        },
        order: { type: 'number', description: 'Lower appears first' },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('LabProject'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'MID Lab', icon: 'BeakerIcon' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        title: { type: 'textarea' },
        objective: { type: 'textarea', props: { rows: 4 } },
        keywords: {
          type: 'textarea',
          description: 'Comma-separated keywords (e.g., "Network Medicine, Computational Biology")'
        },
        imageUrl: {
          type: 'string',
          description: '📸 Upload at http://localhost:5000/upload.html'
        },
        order: { type: 'number', description: 'Lower appears first' },
        isVisible: { type: 'boolean', description: 'Show/hide on website' },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('PhdStudent'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'MID Lab', icon: 'AcademicCap' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        name: { type: 'string' },
        title: { type: 'string', description: 'e.g., Senior Research Fellow' },
        field: { type: 'string' },
        photo: {
          type: 'string',
          description: '📸 Upload at http://localhost:5000/upload.html'
        },
        isAlumni: {
          type: 'boolean',
          description: 'Check if graduated/alumni'
        },
        presentPosition: {
          type: 'textarea',
          description: 'Current position (for alumni)'
        },
        note: { type: 'string', description: 'e.g., (Co-Supervisor)' },
        order: { type: 'number', description: 'Lower appears first' },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('MtechStudent'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'MID Lab', icon: 'UserGroup' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        name: { type: 'string' },
        branch: { type: 'string' },
        order: { type: 'number', description: 'Lower appears first' },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('BtechStudent'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'MID Lab', icon: 'Users' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        name: { type: 'string' },
        branch: { type: 'string' },
        order: { type: 'number', description: 'Lower appears first' },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  // Books
  {
    resource: { 
      model: getModelByName('Book'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Publications & Books', icon: 'BookOpen' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        title: { type: 'textarea' },
        authors: { type: 'textarea' },
        isbn: { type: 'string' },
        publisher: { type: 'string' },
        year: { type: 'string' },
        links: {
          type: 'textarea',
          description: 'JSON format: [{"label":"Amazon","url":"https://..."}]'
        },
        order: { type: 'number', description: 'Lower appears first' },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('BookChapter'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Publications & Books', icon: 'Collection' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        title: { type: 'textarea' },
        authors: { type: 'textarea' },
        bookTitle: { type: 'textarea', description: 'Name of the book this chapter is in' },
        publisher: { type: 'string' },
        year: { type: 'string' },
        isbn: { type: 'string' },
        doi: { type: 'string' },
        refNumber: { type: 'number', description: 'Reference number for citation' },
        order: { type: 'number', description: 'Lower appears first' },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  // Outreach
  {
    resource: { 
      model: getModelByName('Outreach'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Outreach', icon: 'Sparkles' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        title: { type: 'string' },
        description: {
          type: 'textarea',
          props: { rows: 6 }
        },
        imageUrl: {
          type: 'string',
          description: '📸 Upload at http://localhost:5000/upload.html'
        },
        order: { type: 'number', description: 'Lower appears first' },
        isVisible: { type: 'boolean', description: 'Show/hide on website' },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('ComputationalTool'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Computational Tools', icon: 'Code' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        title: { 
          type: 'textarea',
          description: 'Tool name and title'
        },
        description: { 
          type: 'textarea', 
          props: { rows: 4 },
          description: 'Brief description of what the tool does'
        },
        reference: { 
          type: 'textarea', 
          props: { rows: 5 },
          description: 'Full academic reference/citation'
        },
        imageUrl: {
          type: 'string',
          description: '📸 Upload at http://localhost:5000/upload.html'
        },
        url: { 
          type: 'string', 
          description: 'Optional: Direct link to the tool/web server'
        },
        order: { 
          type: 'number', 
          description: 'Display order (lower numbers appear first)'
        },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      },
      listProperties: ['title', 'order', 'url', 'createdAt'],
      editProperties: ['title', 'description', 'reference', 'imageUrl', 'url', 'order'],
      showProperties: ['title', 'description', 'reference', 'imageUrl', 'url', 'order', 'createdAt', 'updatedAt'],
    }
  },
  {
    resource: {
      model: getModelByName('Industry'),
      client: prisma
    },
    options: {
      navigation: { name: 'Industry', icon: 'Factory' },
      sort: { sortBy: 'order', direction: 'asc' },
      properties: {
        companyName: {
          type: 'string'
        },
        location: {
          type: 'string'
        },
        role: {
          type: 'string'
        },
        companyLogo: {
          type: 'string',
          description: '📸 Upload at http://localhost:5000/upload.html'
        },
        order: {
          type: 'number',
          description: 'Lower appears first'
        },
        isVisible: {
          type: 'boolean',
          description: 'Show/hide on website'
        },
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  // Site Settings
  {
    resource: { 
      model: getModelByName('SiteSettings'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Site Settings', icon: 'Settings' },
      properties: {
        // Navbar Section
        logoUrl: {
          type: 'string',
          description: '📸 Navbar Logo - Upload at http://localhost:5000/upload.html'
        },
        siteName: {
          type: 'string',
          description: 'Website/Institution name (optional)'
        },
        
        // Footer Contact Section
        footerName: {
          type: 'string',
          description: 'Name displayed in footer contact section'
        },
        footerTitle: {
          type: 'string',
          description: 'Title/Position displayed in footer'
        },
        footerEmail: {
          type: 'string',
          description: 'Email displayed in footer'
        },
        footerPhone: {
          type: 'string',
          description: 'Phone number displayed in footer'
        },
        footerOffice: {
          type: 'string',
          description: 'Office location displayed in footer'
        },
        
        // Social Links Section
        linkedinUrl: {
          type: 'string',
          description: 'LinkedIn profile URL'
        },
        twitterUrl: {
          type: 'string',
          description: 'Twitter/X profile URL'
        },
        googleScholarUrl: {
          type: 'string',
          description: 'Google Scholar profile URL'
        },
        researchGateUrl: {
          type: 'string',
          description: 'ResearchGate profile URL'
        },
        githubUrl: {
          type: 'string',
          description: 'GitHub profile URL'
        },
        
        // Footer Bottom Section
        copyrightText: {
          type: 'textarea',
          description: 'Copyright text (e.g., "© 2025 All rights reserved.")'
        },
        officialSiteUrl: {
          type: 'string',
          description: 'Official institutional website URL'
        },
        
        createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
        updatedAt: { isVisible: { list: true, filter: true, show: true, edit: false } }
      }
    }
  },
  {
    resource: { 
      model: getModelByName('AdminUser'), 
      client: prisma 
    },
    options: {
      navigation: { name: 'Admin Settings', icon: 'User' },
      properties: {
        email: {
          type: 'string',
        },
        encryptedPassword: { 
          isVisible: false 
        },
        role: {
          type: 'string',
        },
        createdAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        updatedAt: {
          isVisible: { list: true, filter: true, show: true, edit: false },
        }
      }
    }
  }
];

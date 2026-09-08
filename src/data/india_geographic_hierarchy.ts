import { IndianRegion } from '../types';

export interface VillageTownData {
  name: string;
  type: 'village' | 'town' | 'gram_panchayat' | 'city';
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

export interface TalukData {
  name: string; // Taluk / Tehsil / Mandal / Sub-district
  headquarters?: string;
  latitude: number;
  longitude: number;
  pincodes?: string[];
  villagesAndTowns: VillageTownData[];
}

export interface DistrictData {
  name: string;
  headquarters?: string;
  latitude: number;
  longitude: number;
  taluks: TalukData[];
}

export interface StateData {
  state: string;
  code: string;
  region: IndianRegion;
  capital: string;
  districts: DistrictData[];
}

/**
 * Comprehensive Geographic Hierarchy Dataset of India
 * Supporting rural villages, gram panchayats, taluks/tehsils, districts, states & PIN codes across all 28 states & 8 UTs.
 */
export const INDIA_GEOGRAPHIC_HIERARCHY: StateData[] = [
  // =========================================================================
  // 1. KARNATAKA (South India)
  // =========================================================================
  {
    state: 'Karnataka',
    code: 'KA',
    region: 'South India',
    capital: 'Bengaluru',
    districts: [
      {
        name: 'Mysuru',
        headquarters: 'Mysuru',
        latitude: 12.2958,
        longitude: 76.6394,
        taluks: [
          {
            name: 'Nanjangud',
            latitude: 12.1197,
            longitude: 76.6786,
            pincodes: ['571301', '571302', '571129', '571118'],
            villagesAndTowns: [
              { name: 'Hullahalli', type: 'village', pincode: '571314', latitude: 12.0621, longitude: 76.5412 },
              { name: 'Kadakola', type: 'village', pincode: '571311', latitude: 12.1956, longitude: 76.6578 },
              { name: 'Debur', type: 'village', pincode: '571301', latitude: 12.0912, longitude: 76.6914 },
              { name: 'Hadinaru', type: 'village', pincode: '571302', latitude: 12.1489, longitude: 76.6923 },
              { name: 'Immavu', type: 'village', pincode: '571302', latitude: 12.1645, longitude: 76.7112 },
              { name: 'Badanavalu', type: 'village', pincode: '571312', latitude: 12.0456, longitude: 76.7214 },
              { name: 'Thagadur', type: 'gram_panchayat', pincode: '571119', latitude: 12.1345, longitude: 76.8123 },
              { name: 'Hemmaragala', type: 'village', pincode: '571301', latitude: 12.0812, longitude: 76.6432 },
              { name: 'Kowlande', type: 'gram_panchayat', pincode: '571312', latitude: 12.0543, longitude: 76.7543 },
              { name: 'Nanjangud Town', type: 'town', pincode: '571301', latitude: 12.1197, longitude: 76.6786 }
            ]
          },
          {
            name: 'Hunsur',
            latitude: 12.3082,
            longitude: 76.2917,
            pincodes: ['571105', '571189'],
            villagesAndTowns: [
              { name: 'Bilikere', type: 'gram_panchayat', pincode: '571103', latitude: 12.3211, longitude: 76.4321 },
              { name: 'Rathehalli', type: 'village', pincode: '571105', latitude: 12.2891, longitude: 76.2456 },
              { name: 'Gavadagere', type: 'village', pincode: '571610', latitude: 12.3812, longitude: 76.3123 },
              { name: 'Hunsur Town', type: 'town', pincode: '571105', latitude: 12.3082, longitude: 76.2917 }
            ]
          },
          {
            name: 'T. Narasipura',
            latitude: 12.2132,
            longitude: 76.9042,
            pincodes: ['571124', '571110'],
            villagesAndTowns: [
              { name: 'Bannur', type: 'town', pincode: '571101', latitude: 12.3312, longitude: 76.8623 },
              { name: 'Sosale', type: 'village', pincode: '571120', latitude: 12.1987, longitude: 76.9341 },
              { name: 'Mugur', type: 'gram_panchayat', pincode: '571124', latitude: 12.1567, longitude: 76.9782 },
              { name: 'T. Narasipura Town', type: 'town', pincode: '571124', latitude: 12.2132, longitude: 76.9042 }
            ]
          },
          {
            name: 'K.R. Nagar (Krishnarajanagara)',
            latitude: 12.4419,
            longitude: 76.3817,
            pincodes: ['571602', '571601'],
            villagesAndTowns: [
              { name: 'Chunchanakatte', type: 'village', pincode: '571604', latitude: 12.5023, longitude: 76.2845 },
              { name: 'Saligrama', type: 'town', pincode: '571604', latitude: 12.5643, longitude: 76.3214 },
              { name: 'Mirle', type: 'gram_panchayat', pincode: '571603', latitude: 12.4891, longitude: 76.4123 },
              { name: 'K.R. Nagar Town', type: 'town', pincode: '571602', latitude: 12.4419, longitude: 76.3817 }
            ]
          },
          {
            name: 'H.D. Kote (Heggadadevankote)',
            latitude: 11.9961,
            longitude: 76.3242,
            pincodes: ['571114', '571121'],
            villagesAndTowns: [
              { name: 'Saragur', type: 'town', pincode: '571121', latitude: 11.9812, longitude: 76.4123 },
              { name: 'Antharasanthe', type: 'gram_panchayat', pincode: '571114', latitude: 11.8912, longitude: 76.3456 },
              { name: 'H.D. Kote Town', type: 'town', pincode: '571114', latitude: 11.9961, longitude: 76.3242 }
            ]
          },
          {
            name: 'Mysuru Taluk',
            latitude: 12.2958,
            longitude: 76.6394,
            pincodes: ['570001', '570008', '570016', '570020', '570026'],
            villagesAndTowns: [
              { name: 'Jayapura', type: 'gram_panchayat', pincode: '570008', latitude: 12.2214, longitude: 76.5432 },
              { name: 'Yelwala', type: 'village', pincode: '571130', latitude: 12.3567, longitude: 76.5123 },
              { name: 'Varuna', type: 'village', pincode: '570010', latitude: 12.2678, longitude: 76.7345 },
              { name: 'Srirampura', type: 'town', pincode: '570023', latitude: 12.2612, longitude: 76.6214 },
              { name: 'Mysuru City', type: 'city', pincode: '570001', latitude: 12.2958, longitude: 76.6394 }
            ]
          },
          {
            name: 'Periyapatna',
            latitude: 12.3392,
            longitude: 75.9922,
            pincodes: ['571107', '571108'],
            villagesAndTowns: [
              { name: 'Bettadapura', type: 'gram_panchayat', pincode: '571102', latitude: 12.4412, longitude: 76.0456 },
              { name: 'Ravandur', type: 'village', pincode: '571107', latitude: 12.3812, longitude: 76.1123 },
              { name: 'Periyapatna Town', type: 'town', pincode: '571107', latitude: 12.3392, longitude: 75.9922 }
            ]
          }
        ]
      },
      {
        name: 'Mandya',
        headquarters: 'Mandya',
        latitude: 12.5244,
        longitude: 76.8958,
        taluks: [
          {
            name: 'Pandavapura',
            latitude: 12.4961,
            longitude: 76.6714,
            pincodes: ['571434', '571435'],
            villagesAndTowns: [
              { name: 'Melukote', type: 'town', pincode: '571431', latitude: 12.6645, longitude: 76.6578 },
              { name: 'Chinkurali', type: 'village', pincode: '571434', latitude: 12.5412, longitude: 76.5912 },
              { name: 'Pandavapura Town', type: 'town', pincode: '571434', latitude: 12.4961, longitude: 76.6714 }
            ]
          },
          {
            name: 'Srirangapatna',
            latitude: 12.4218,
            longitude: 76.6932,
            pincodes: ['571438', '571415'],
            villagesAndTowns: [
              { name: 'Arakere', type: 'gram_panchayat', pincode: '571415', latitude: 12.4789, longitude: 76.7912 },
              { name: 'Palahalli', type: 'village', pincode: '571438', latitude: 12.4012, longitude: 76.6432 },
              { name: 'Srirangapatna Town', type: 'town', pincode: '571438', latitude: 12.4218, longitude: 76.6932 }
            ]
          },
          {
            name: 'Maddur',
            latitude: 12.5842,
            longitude: 77.0456,
            pincodes: ['571428', '571429'],
            villagesAndTowns: [
              { name: 'Besagarahalli', type: 'village', pincode: '571419', latitude: 12.5123, longitude: 77.0123 },
              { name: 'Koppa', type: 'gram_panchayat', pincode: '571425', latitude: 12.6412, longitude: 77.0812 },
              { name: 'Maddur Town', type: 'town', pincode: '571428', latitude: 12.5842, longitude: 77.0456 }
            ]
          },
          {
            name: 'Malavalli',
            latitude: 12.3856,
            longitude: 77.0567,
            pincodes: ['571430', '571417'],
            villagesAndTowns: [
              { name: 'Halagur', type: 'town', pincode: '571421', latitude: 12.4412, longitude: 77.1912 },
              { name: 'Belakavadi', type: 'village', pincode: '571417', latitude: 12.3012, longitude: 77.1023 },
              { name: 'Malavalli Town', type: 'town', pincode: '571430', latitude: 12.3856, longitude: 77.0567 }
            ]
          },
          {
            name: 'Mandya Taluk',
            latitude: 12.5244,
            longitude: 76.8958,
            pincodes: ['571401', '571402', '571403'],
            villagesAndTowns: [
              { name: 'Dudda', type: 'village', pincode: '571405', latitude: 12.6012, longitude: 76.8456 },
              { name: 'Keregodu', type: 'gram_panchayat', pincode: '571446', latitude: 12.5891, longitude: 76.9567 },
              { name: 'Mandya City', type: 'city', pincode: '571401', latitude: 12.5244, longitude: 76.8958 }
            ]
          }
        ]
      },
      {
        name: 'Hassan',
        headquarters: 'Hassan',
        latitude: 13.0033,
        longitude: 76.1004,
        taluks: [
          {
            name: 'Channarayapatna',
            latitude: 12.9061,
            longitude: 76.3912,
            pincodes: ['573116', '573135'],
            villagesAndTowns: [
              { name: 'Shravanabelagola', type: 'town', pincode: '573135', latitude: 12.8578, longitude: 76.4845 },
              { name: 'Nuggehalli', type: 'gram_panchayat', pincode: '573131', latitude: 13.0112, longitude: 76.4712 },
              { name: 'Channarayapatna Town', type: 'town', pincode: '573116', latitude: 12.9061, longitude: 76.3912 }
            ]
          },
          {
            name: 'Holenarasipura',
            latitude: 12.7845,
            longitude: 76.2412,
            pincodes: ['573211', '573218'],
            villagesAndTowns: [
              { name: 'Halekote', type: 'village', pincode: '573211', latitude: 12.8412, longitude: 76.2912 },
              { name: 'Holenarasipura Town', type: 'town', pincode: '573211', latitude: 12.7845, longitude: 76.2412 }
            ]
          },
          {
            name: 'Sakleshpur',
            latitude: 12.9412,
            longitude: 75.7845,
            pincodes: ['573134', '573127'],
            villagesAndTowns: [
              { name: 'Hanbal', type: 'gram_panchayat', pincode: '573165', latitude: 12.9912, longitude: 75.6912 },
              { name: 'Yeslur', type: 'village', pincode: '573137', latitude: 12.8123, longitude: 75.8345 },
              { name: 'Sakleshpur Town', type: 'town', pincode: '573134', latitude: 12.9412, longitude: 75.7845 }
            ]
          },
          {
            name: 'Belur',
            latitude: 13.1645,
            longitude: 75.8612,
            pincodes: ['573115', '573121'],
            villagesAndTowns: [
              { name: 'Halebidu', type: 'town', pincode: '573121', latitude: 13.2145, longitude: 75.9912 },
              { name: 'Arehalli', type: 'village', pincode: '573101', latitude: 13.0912, longitude: 75.7912 },
              { name: 'Belur Town', type: 'town', pincode: '573115', latitude: 13.1645, longitude: 75.8612 }
            ]
          },
          {
            name: 'Hassan Taluk',
            latitude: 13.0033,
            longitude: 76.1004,
            pincodes: ['573201', '573202'],
            villagesAndTowns: [
              { name: 'Dudda Hassan', type: 'village', pincode: '573118', latitude: 13.1123, longitude: 76.1912 },
              { name: 'Shanthigrama', type: 'gram_panchayat', pincode: '573220', latitude: 12.9612, longitude: 76.2145 },
              { name: 'Hassan City', type: 'city', pincode: '573201', latitude: 13.0033, longitude: 76.1004 }
            ]
          }
        ]
      },
      {
        name: 'Bengaluru Urban',
        headquarters: 'Bengaluru',
        latitude: 12.9716,
        longitude: 77.5946,
        taluks: [
          {
            name: 'Anekal',
            latitude: 12.7112,
            longitude: 77.6978,
            pincodes: ['562106', '560099', '560100', '560105'],
            villagesAndTowns: [
              { name: 'Jigani', type: 'town', pincode: '560105', latitude: 12.7845, longitude: 77.6412 },
              { name: 'Chandapura', type: 'town', pincode: '560099', latitude: 12.7989, longitude: 77.7012 },
              { name: 'Attibele', type: 'town', pincode: '562107', latitude: 12.7789, longitude: 77.7712 },
              { name: 'Bannerghatta Village', type: 'village', pincode: '560083', latitude: 12.8012, longitude: 77.5745 },
              { name: 'Anekal Town', type: 'town', pincode: '562106', latitude: 12.7112, longitude: 77.6978 }
            ]
          },
          {
            name: 'Bengaluru North',
            latitude: 13.0412,
            longitude: 77.5812,
            pincodes: ['560064', '560092', '560024'],
            villagesAndTowns: [
              { name: 'Yelahanka', type: 'city', pincode: '560064', latitude: 13.1007, longitude: 77.5963 },
              { name: 'Hesaraghatta', type: 'village', pincode: '560088', latitude: 13.1412, longitude: 77.4912 },
              { name: 'Jakkur', type: 'town', pincode: '560064', latitude: 13.0789, longitude: 77.6123 }
            ]
          },
          {
            name: 'Bengaluru South',
            latitude: 12.9112,
            longitude: 77.5612,
            pincodes: ['560078', '560062', '560041'],
            villagesAndTowns: [
              { name: 'Kengeri', type: 'city', pincode: '560060', latitude: 12.9112, longitude: 77.4812 },
              { name: 'Begur', type: 'town', pincode: '560068', latitude: 12.8789, longitude: 77.6312 },
              { name: 'Uttarahalli', type: 'town', pincode: '560061', latitude: 12.9012, longitude: 77.5412 }
            ]
          },
          {
            name: 'Bengaluru East',
            latitude: 12.9912,
            longitude: 77.6912,
            pincodes: ['560066', '560037', '560049'],
            villagesAndTowns: [
              { name: 'Whitefield', type: 'city', pincode: '560066', latitude: 12.9698, longitude: 77.7499 },
              { name: 'Varthur', type: 'town', pincode: '560087', latitude: 12.9412, longitude: 77.7412 },
              { name: 'KR Puram', type: 'city', pincode: '560036', latitude: 13.0078, longitude: 77.6961 }
            ]
          }
        ]
      },
      {
        name: 'Bengaluru Rural',
        headquarters: 'Devanahalli',
        latitude: 13.2456,
        longitude: 77.7123,
        taluks: [
          {
            name: 'Devanahalli',
            latitude: 13.2456,
            longitude: 77.7123,
            pincodes: ['562110', '562129'],
            villagesAndTowns: [
              { name: 'Kundana', type: 'village', pincode: '562110', latitude: 13.2123, longitude: 77.6214 },
              { name: 'Vijayapura Rural', type: 'town', pincode: '562135', latitude: 13.2912, longitude: 77.7912 },
              { name: 'Devanahalli Town', type: 'town', pincode: '562110', latitude: 13.2456, longitude: 77.7123 }
            ]
          },
          {
            name: 'Doddaballapura',
            latitude: 13.2912,
            longitude: 77.5345,
            pincodes: ['561203', '561205'],
            villagesAndTowns: [
              { name: 'Tubagere', type: 'village', pincode: '561205', latitude: 13.3412, longitude: 77.6123 },
              { name: 'Doddaballapura Town', type: 'town', pincode: '561203', latitude: 13.2912, longitude: 77.5345 }
            ]
          },
          {
            name: 'Hosakote',
            latitude: 13.0712,
            longitude: 77.7989,
            pincodes: ['562114', '562122'],
            villagesAndTowns: [
              { name: 'Nandagudi', type: 'gram_panchayat', pincode: '562122', latitude: 13.1512, longitude: 77.8912 },
              { name: 'Hosakote Town', type: 'town', pincode: '562114', latitude: 13.0712, longitude: 77.7989 }
            ]
          },
          {
            name: 'Nelamangala',
            latitude: 13.0989,
            longitude: 77.3912,
            pincodes: ['562123', '562162'],
            villagesAndTowns: [
              { name: 'Thyamagondlu', type: 'town', pincode: '562132', latitude: 13.2123, longitude: 77.2912 },
              { name: 'Nelamangala Town', type: 'town', pincode: '562123', latitude: 13.0989, longitude: 77.3912 }
            ]
          }
        ]
      },
      {
        name: 'Dakshina Kannada',
        headquarters: 'Mangaluru',
        latitude: 12.9141,
        longitude: 74.856,
        taluks: [
          {
            name: 'Bantwal',
            latitude: 12.8912,
            longitude: 75.0345,
            pincodes: ['574211', '574219'],
            villagesAndTowns: [
              { name: 'B.C. Road', type: 'town', pincode: '574219', latitude: 12.8812, longitude: 75.0212 },
              { name: 'Mani', type: 'village', pincode: '574253', latitude: 12.8214, longitude: 75.1412 },
              { name: 'Bantwal Town', type: 'town', pincode: '574211', latitude: 12.8912, longitude: 75.0345 }
            ]
          },
          {
            name: 'Puttur',
            latitude: 12.7645,
            longitude: 75.2012,
            pincodes: ['574201', '574202'],
            villagesAndTowns: [
              { name: 'Uppinangady', type: 'town', pincode: '574241', latitude: 12.8412, longitude: 75.2512 },
              { name: 'Puttur Town', type: 'town', pincode: '574201', latitude: 12.7645, longitude: 75.2012 }
            ]
          },
          {
            name: 'Belthangady',
            latitude: 13.0012,
            longitude: 75.2912,
            pincodes: ['574214', '574240'],
            villagesAndTowns: [
              { name: 'Dharmasthala', type: 'town', pincode: '574216', latitude: 12.9512, longitude: 75.3812 },
              { name: 'Ujire', type: 'town', pincode: '574240', latitude: 13.0123, longitude: 75.3312 },
              { name: 'Belthangady Town', type: 'town', pincode: '574214', latitude: 13.0012, longitude: 75.2912 }
            ]
          },
          {
            name: 'Sullia',
            latitude: 12.5612,
            longitude: 75.3912,
            pincodes: ['574239', '574238'],
            villagesAndTowns: [
              { name: 'Subrahmanya', type: 'town', pincode: '574238', latitude: 12.6789, longitude: 75.6123 },
              { name: 'Sullia Town', type: 'town', pincode: '574239', latitude: 12.5612, longitude: 75.3912 }
            ]
          },
          {
            name: 'Mangaluru Taluk',
            latitude: 12.9141,
            longitude: 74.856,
            pincodes: ['575001', '575003', '575006'],
            villagesAndTowns: [
              { name: 'Surathkal', type: 'town', pincode: '575014', latitude: 13.0112, longitude: 74.7912 },
              { name: 'Moodbidri', type: 'town', pincode: '574227', latitude: 13.0712, longitude: 74.9989 },
              { name: 'Mangaluru City', type: 'city', pincode: '575001', latitude: 12.9141, longitude: 74.856 }
            ]
          }
        ]
      },
      {
        name: 'Belagavi',
        headquarters: 'Belagavi',
        latitude: 15.8497,
        longitude: 74.4977,
        taluks: [
          {
            name: 'Chikkodi',
            latitude: 16.4312,
            longitude: 74.5989,
            pincodes: ['591201', '591202'],
            villagesAndTowns: [
              { name: 'Nipani', type: 'town', pincode: '591237', latitude: 16.4012, longitude: 74.3812 },
              { name: 'Sadalga', type: 'village', pincode: '591239', latitude: 16.5712, longitude: 74.5312 },
              { name: 'Chikkodi Town', type: 'town', pincode: '591201', latitude: 16.4312, longitude: 74.5989 }
            ]
          },
          {
            name: 'Gokak',
            latitude: 16.1689,
            longitude: 74.8214,
            pincodes: ['591307', '591306'],
            villagesAndTowns: [
              { name: 'Gokak Falls', type: 'village', pincode: '591308', latitude: 16.1891, longitude: 74.7712 },
              { name: 'Gokak Town', type: 'town', pincode: '591307', latitude: 16.1689, longitude: 74.8214 }
            ]
          },
          {
            name: 'Bailhongal',
            latitude: 15.8123,
            longitude: 74.8612,
            pincodes: ['591102', '591104'],
            villagesAndTowns: [
              { name: 'Kittur', type: 'town', pincode: '591115', latitude: 15.6012, longitude: 74.7912 },
              { name: 'Bailhongal Town', type: 'town', pincode: '591102', latitude: 15.8123, longitude: 74.8612 }
            ]
          }
        ]
      },
      {
        name: 'Tumakuru',
        headquarters: 'Tumakuru',
        latitude: 13.3409,
        longitude: 77.101,
        taluks: [
          {
            name: 'Tiptur',
            latitude: 13.2612,
            longitude: 76.4812,
            pincodes: ['572201', '572202'],
            villagesAndTowns: [
              { name: 'Kibbanahalli', type: 'village', pincode: '572114', latitude: 13.3123, longitude: 76.6412 },
              { name: 'Tiptur Town', type: 'town', pincode: '572201', latitude: 13.2612, longitude: 76.4812 }
            ]
          },
          {
            name: 'Kunigal',
            latitude: 13.0234,
            longitude: 77.0345,
            pincodes: ['572130', '572126'],
            villagesAndTowns: [
              { name: 'Yediyur', type: 'village', pincode: '572142', latitude: 12.9812, longitude: 76.8912 },
              { name: 'Kunigal Town', type: 'town', pincode: '572130', latitude: 13.0234, longitude: 77.0345 }
            ]
          },
          {
            name: 'Sira',
            latitude: 13.7456,
            longitude: 76.9123,
            pincodes: ['572137', '572139'],
            villagesAndTowns: [
              { name: 'Bukkapatna', type: 'village', pincode: '572115', latitude: 13.6214, longitude: 76.7412 },
              { name: 'Sira Town', type: 'town', pincode: '572137', latitude: 13.7456, longitude: 76.9123 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 2. TAMIL NADU (South India)
  // =========================================================================
  {
    state: 'Tamil Nadu',
    code: 'TN',
    region: 'South India',
    capital: 'Chennai',
    districts: [
      {
        name: 'Coimbatore',
        headquarters: 'Coimbatore',
        latitude: 11.0168,
        longitude: 76.9558,
        taluks: [
          {
            name: 'Pollachi',
            latitude: 10.6612,
            longitude: 77.0089,
            pincodes: ['642001', '642002', '642003', '642103'],
            villagesAndTowns: [
              { name: 'Anaimalai', type: 'town', pincode: '642104', latitude: 10.5845, longitude: 76.9312 },
              { name: 'Kottur', type: 'town', pincode: '642114', latitude: 10.5312, longitude: 76.9812 },
              { name: 'Negamam', type: 'village', pincode: '642120', latitude: 10.7412, longitude: 77.0789 },
              { name: 'Samathur', type: 'village', pincode: '642123', latitude: 10.6214, longitude: 76.9543 },
              { name: 'Vettaikaranpudur', type: 'town', pincode: '642129', latitude: 10.5612, longitude: 76.9012 },
              { name: 'Pollachi Town', type: 'town', pincode: '642001', latitude: 10.6612, longitude: 77.0089 }
            ]
          },
          {
            name: 'Sulur',
            latitude: 11.0289,
            longitude: 77.1256,
            pincodes: ['641402', '641659'],
            villagesAndTowns: [
              { name: 'Somanur', type: 'town', pincode: '641668', latitude: 11.0912, longitude: 77.1912 },
              { name: 'Sultanpet', type: 'village', pincode: '641669', latitude: 10.9214, longitude: 77.1456 },
              { name: 'Sulur Town', type: 'town', pincode: '641402', latitude: 11.0289, longitude: 77.1256 }
            ]
          },
          {
            name: 'Mettupalayam',
            latitude: 11.3012,
            longitude: 76.9456,
            pincodes: ['641301', '641305'],
            villagesAndTowns: [
              { name: 'Sirumugai', type: 'town', pincode: '641302', latitude: 11.3312, longitude: 77.0012 },
              { name: 'Karamadai', type: 'town', pincode: '641104', latitude: 11.2412, longitude: 76.9612 },
              { name: 'Mettupalayam Town', type: 'town', pincode: '641301', latitude: 11.3012, longitude: 76.9456 }
            ]
          },
          {
            name: 'Coimbatore South',
            latitude: 10.9812,
            longitude: 76.9612,
            pincodes: ['641008', '641021', '641005'],
            villagesAndTowns: [
              { name: 'Singanallur', type: 'town', pincode: '641005', latitude: 10.9989, longitude: 77.0123 },
              { name: 'Sundarapuram', type: 'town', pincode: '641024', latitude: 10.9412, longitude: 76.9712 },
              { name: 'Coimbatore City', type: 'city', pincode: '641001', latitude: 11.0168, longitude: 76.9558 }
            ]
          }
        ]
      },
      {
        name: 'Madurai',
        headquarters: 'Madurai',
        latitude: 9.9252,
        longitude: 78.1198,
        taluks: [
          {
            name: 'Melur',
            latitude: 10.0289,
            longitude: 78.3345,
            pincodes: ['625106', '625105'],
            villagesAndTowns: [
              { name: 'Kottampatti', type: 'town', pincode: '625103', latitude: 10.1512, longitude: 78.4312 },
              { name: 'Therkutheru', type: 'village', pincode: '625122', latitude: 9.9912, longitude: 78.2712 },
              { name: 'Melur Town', type: 'town', pincode: '625106', latitude: 10.0289, longitude: 78.3345 }
            ]
          },
          {
            name: 'Usilampatti',
            latitude: 9.9689,
            longitude: 77.7912,
            pincodes: ['625532', '625537'],
            villagesAndTowns: [
              { name: 'Sedapatti', type: 'village', pincode: '625527', latitude: 9.8712, longitude: 77.7812 },
              { name: 'Usilampatti Town', type: 'town', pincode: '625532', latitude: 9.9689, longitude: 77.7912 }
            ]
          },
          {
            name: 'Thirumangalam',
            latitude: 9.8214,
            longitude: 77.9891,
            pincodes: ['625706', '625704'],
            villagesAndTowns: [
              { name: 'Kalligudi', type: 'village', pincode: '625701', latitude: 9.7112, longitude: 77.9412 },
              { name: 'Thirumangalam Town', type: 'town', pincode: '625706', latitude: 9.8214, longitude: 77.9891 }
            ]
          }
        ]
      },
      {
        name: 'Salem',
        headquarters: 'Salem',
        latitude: 11.6643,
        longitude: 78.146,
        taluks: [
          {
            name: 'Attur',
            latitude: 11.5912,
            longitude: 78.6012,
            pincodes: ['636102', '636141'],
            villagesAndTowns: [
              { name: 'Thalaivasal', type: 'town', pincode: '636112', latitude: 11.5812, longitude: 78.7456 },
              { name: 'Attur Town', type: 'town', pincode: '636102', latitude: 11.5912, longitude: 78.6012 }
            ]
          },
          {
            name: 'Mettur',
            latitude: 11.7945,
            longitude: 77.8012,
            pincodes: ['636401', '636402'],
            villagesAndTowns: [
              { name: 'Kolathur Salem', type: 'village', pincode: '636303', latitude: 11.8912, longitude: 77.7912 },
              { name: 'Mettur Dam', type: 'town', pincode: '636401', latitude: 11.7945, longitude: 77.8012 }
            ]
          }
        ]
      },
      {
        name: 'Chennai',
        headquarters: 'Chennai',
        latitude: 13.0827,
        longitude: 80.2707,
        taluks: [
          {
            name: 'Tambaram',
            latitude: 12.9249,
            longitude: 80.1488,
            pincodes: ['600045', '600059'],
            villagesAndTowns: [
              { name: 'Chromepet', type: 'city', pincode: '600044', latitude: 12.9512, longitude: 80.1412 },
              { name: 'Tambaram Town', type: 'city', pincode: '600045', latitude: 12.9249, longitude: 80.1488 }
            ]
          },
          {
            name: 'Guindy',
            latitude: 13.0067,
            longitude: 80.2021,
            pincodes: ['600032', '600085'],
            villagesAndTowns: [
              { name: 'Adyar', type: 'city', pincode: '600020', latitude: 13.0012, longitude: 80.2567 },
              { name: 'Guindy Central', type: 'city', pincode: '600032', latitude: 13.0067, longitude: 80.2021 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 3. KERALA (South India)
  // =========================================================================
  {
    state: 'Kerala',
    code: 'KL',
    region: 'South India',
    capital: 'Thiruvananthapuram',
    districts: [
      {
        name: 'Ernakulam',
        headquarters: 'Kochi',
        latitude: 9.9816,
        longitude: 76.2999,
        taluks: [
          {
            name: 'Aluva',
            latitude: 10.1076,
            longitude: 76.3516,
            pincodes: ['683101', '683102', '683572'],
            villagesAndTowns: [
              { name: 'Chengamanad', type: 'gram_panchayat', pincode: '683578', latitude: 10.1512, longitude: 76.3612 },
              { name: 'Nedumbassery', type: 'gram_panchayat', pincode: '683585', latitude: 10.1545, longitude: 76.3912 },
              { name: 'Choornikkara', type: 'village', pincode: '683106', latitude: 10.0812, longitude: 76.3412 },
              { name: 'Edathala', type: 'village', pincode: '683561', latitude: 10.0612, longitude: 76.3812 },
              { name: 'Kadungalloor', type: 'village', pincode: '683108', latitude: 10.1012, longitude: 76.3112 },
              { name: 'Aluva Town', type: 'town', pincode: '683101', latitude: 10.1076, longitude: 76.3516 }
            ]
          },
          {
            name: 'Kothamangalam',
            latitude: 10.0612,
            longitude: 76.6214,
            pincodes: ['686691', '686681'],
            villagesAndTowns: [
              { name: 'Neriamangalam', type: 'village', pincode: '686693', latitude: 10.0512, longitude: 76.7812 },
              { name: 'Kothamangalam Town', type: 'town', pincode: '686691', latitude: 10.0612, longitude: 76.6214 }
            ]
          },
          {
            name: 'Kanayannur (Kochi)',
            latitude: 9.9312,
            longitude: 76.2673,
            pincodes: ['682001', '682016', '682030'],
            villagesAndTowns: [
              { name: 'Tripunithura', type: 'town', pincode: '682301', latitude: 9.9489, longitude: 76.3412 },
              { name: 'Kakkanad', type: 'city', pincode: '682030', latitude: 10.0159, longitude: 76.3419 },
              { name: 'Kochi City', type: 'city', pincode: '682001', latitude: 9.9312, longitude: 76.2673 }
            ]
          }
        ]
      },
      {
        name: 'Thiruvananthapuram',
        headquarters: 'Thiruvananthapuram',
        latitude: 8.5241,
        longitude: 76.9366,
        taluks: [
          {
            name: 'Neyyattinkara',
            latitude: 8.4012,
            longitude: 77.0812,
            pincodes: ['695121', '695122'],
            villagesAndTowns: [
              { name: 'Balaramapuram', type: 'town', pincode: '695501', latitude: 8.4214, longitude: 77.0456 },
              { name: 'Parasala', type: 'town', pincode: '695502', latitude: 8.3412, longitude: 77.1512 },
              { name: 'Neyyattinkara Town', type: 'town', pincode: '695121', latitude: 8.4012, longitude: 77.0812 }
            ]
          },
          {
            name: 'Nedumangad',
            latitude: 8.6012,
            longitude: 76.9989,
            pincodes: ['695541', '695542'],
            villagesAndTowns: [
              { name: 'Palode', type: 'village', pincode: '695562', latitude: 8.7012, longitude: 77.0312 },
              { name: 'Nedumangad Town', type: 'town', pincode: '695541', latitude: 8.6012, longitude: 76.9989 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 4. TELANGANA (South India)
  // =========================================================================
  {
    state: 'Telangana',
    code: 'TG',
    region: 'South India',
    capital: 'Hyderabad',
    districts: [
      {
        name: 'Hyderabad',
        headquarters: 'Hyderabad',
        latitude: 17.385,
        longitude: 78.4867,
        taluks: [
          {
            name: 'Charminar (Mandal)',
            latitude: 17.3616,
            longitude: 78.4747,
            pincodes: ['500002', '500065'],
            villagesAndTowns: [
              { name: 'Moghalpura', type: 'city', pincode: '500002', latitude: 17.3589, longitude: 78.4812 },
              { name: 'Old City Central', type: 'city', pincode: '500002', latitude: 17.3616, longitude: 78.4747 }
            ]
          },
          {
            name: 'Secunderabad (Mandal)',
            latitude: 17.4399,
            longitude: 78.4983,
            pincodes: ['500003', '500010'],
            villagesAndTowns: [
              { name: 'Tirumalagiri', type: 'city', pincode: '500015', latitude: 17.4712, longitude: 78.5012 },
              { name: 'Secunderabad Cantt', type: 'city', pincode: '500003', latitude: 17.4399, longitude: 78.4983 }
            ]
          }
        ]
      },
      {
        name: 'Warangal',
        headquarters: 'Warangal',
        latitude: 17.9689,
        longitude: 79.5941,
        taluks: [
          {
            name: 'Hanamkonda',
            latitude: 18.0012,
            longitude: 79.5612,
            pincodes: ['506001', '506002'],
            villagesAndTowns: [
              { name: 'Kazipet', type: 'town', pincode: '506003', latitude: 17.9812, longitude: 79.5123 },
              { name: 'Hanamkonda Town', type: 'city', pincode: '506001', latitude: 18.0012, longitude: 79.5612 }
            ]
          },
          {
            name: 'Parkal',
            latitude: 18.2012,
            longitude: 79.7123,
            pincodes: ['506164', '506168'],
            villagesAndTowns: [
              { name: 'Atmakur Warangal', type: 'village', pincode: '506342', latitude: 18.1512, longitude: 79.6412 },
              { name: 'Parkal Town', type: 'town', pincode: '506164', latitude: 18.2012, longitude: 79.7123 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 5. ANDHRA PRADESH (South India)
  // =========================================================================
  {
    state: 'Andhra Pradesh',
    code: 'AP',
    region: 'South India',
    capital: 'Amaravati',
    districts: [
      {
        name: 'Visakhapatnam',
        headquarters: 'Visakhapatnam',
        latitude: 17.6868,
        longitude: 83.2185,
        taluks: [
          {
            name: 'Anakapalle',
            latitude: 17.6912,
            longitude: 83.0034,
            pincodes: ['531001', '531002'],
            villagesAndTowns: [
              { name: 'Kasimkota', type: 'village', pincode: '531031', latitude: 17.6412, longitude: 82.9712 },
              { name: 'Anakapalle Town', type: 'town', pincode: '531001', latitude: 17.6912, longitude: 83.0034 }
            ]
          },
          {
            name: 'Bheemunipatnam (Bheemili)',
            latitude: 17.8912,
            longitude: 83.4567,
            pincodes: ['531163', '530048'],
            villagesAndTowns: [
              { name: 'Tagarapuvalasa', type: 'town', pincode: '531162', latitude: 17.9214, longitude: 83.4312 },
              { name: 'Bheemili Town', type: 'town', pincode: '531163', latitude: 17.8912, longitude: 83.4567 }
            ]
          }
        ]
      },
      {
        name: 'Tirupati (Chittoor)',
        headquarters: 'Tirupati',
        latitude: 13.6288,
        longitude: 79.4192,
        taluks: [
          {
            name: 'Chandragiri',
            latitude: 13.5845,
            longitude: 79.3123,
            pincodes: ['517101', '517102'],
            villagesAndTowns: [
              { name: 'A Rangampet', type: 'village', pincode: '517102', latitude: 13.6123, longitude: 79.2812 },
              { name: 'Chandragiri Town', type: 'town', pincode: '517101', latitude: 13.5845, longitude: 79.3123 }
            ]
          },
          {
            name: 'Srikalahasti',
            latitude: 13.7512,
            longitude: 79.7012,
            pincodes: ['517644', '517640'],
            villagesAndTowns: [
              { name: 'Thottambedu', type: 'village', pincode: '517642', latitude: 13.7812, longitude: 79.7812 },
              { name: 'Srikalahasti Town', type: 'town', pincode: '517644', latitude: 13.7512, longitude: 79.7012 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 6. MAHARASHTRA (West India)
  // =========================================================================
  {
    state: 'Maharashtra',
    code: 'MH',
    region: 'West India',
    capital: 'Mumbai',
    districts: [
      {
        name: 'Pune',
        headquarters: 'Pune',
        latitude: 18.5204,
        longitude: 73.8567,
        taluks: [
          {
            name: 'Baramati',
            latitude: 18.1516,
            longitude: 74.5768,
            pincodes: ['413102', '413133', '413116'],
            villagesAndTowns: [
              { name: 'Malegaon Budruk', type: 'gram_panchayat', pincode: '413115', latitude: 18.1214, longitude: 74.5214 },
              { name: 'Songaon', type: 'village', pincode: '413102', latitude: 18.1891, longitude: 74.6412 },
              { name: 'Nira Vagaj', type: 'village', pincode: '413102', latitude: 18.0912, longitude: 74.4912 },
              { name: 'Baramati Town', type: 'town', pincode: '413102', latitude: 18.1516, longitude: 74.5768 }
            ]
          },
          {
            name: 'Haveli',
            latitude: 18.4912,
            longitude: 73.9412,
            pincodes: ['412207', '411028', '412308'],
            villagesAndTowns: [
              { name: 'Hadapsar', type: 'city', pincode: '411028', latitude: 18.5089, longitude: 73.9258 },
              { name: 'Wagholi', type: 'town', pincode: '412207', latitude: 18.5812, longitude: 73.9812 },
              { name: 'Uruli Kanchan', type: 'village', pincode: '412202', latitude: 18.4812, longitude: 74.1312 }
            ]
          },
          {
            name: 'Shirur',
            latitude: 18.8245,
            longitude: 74.3789,
            pincodes: ['412210', '412208'],
            villagesAndTowns: [
              { name: 'Sanaswadi', type: 'village', pincode: '412208', latitude: 18.6712, longitude: 74.0812 },
              { name: 'Shirur Town', type: 'town', pincode: '412210', latitude: 18.8245, longitude: 74.3789 }
            ]
          }
        ]
      },
      {
        name: 'Mumbai Suburban',
        headquarters: 'Bandra',
        latitude: 19.0596,
        longitude: 72.8295,
        taluks: [
          {
            name: 'Andheri',
            latitude: 19.1197,
            longitude: 72.8468,
            pincodes: ['400058', '400069', '400053'],
            villagesAndTowns: [
              { name: 'Versova', type: 'city', pincode: '400061', latitude: 19.1312, longitude: 72.8123 },
              { name: 'Marol', type: 'city', pincode: '400059', latitude: 19.1189, longitude: 72.8789 }
            ]
          },
          {
            name: 'Borivali',
            latitude: 19.2307,
            longitude: 72.8567,
            pincodes: ['400092', '400066', '400091'],
            villagesAndTowns: [
              { name: 'Gorai', type: 'village', pincode: '400091', latitude: 19.2412, longitude: 72.7812 },
              { name: 'Kandivali', type: 'city', pincode: '400067', latitude: 19.2089, longitude: 72.8456 }
            ]
          }
        ]
      },
      {
        name: 'Nagpur',
        headquarters: 'Nagpur',
        latitude: 21.1458,
        longitude: 79.0882,
        taluks: [
          {
            name: 'Umred',
            latitude: 20.8512,
            longitude: 79.3245,
            pincodes: ['441203', '441204'],
            villagesAndTowns: [
              { name: 'Bhiwapur', type: 'town', pincode: '441201', latitude: 20.7612, longitude: 79.5214 },
              { name: 'Umred Town', type: 'town', pincode: '441203', latitude: 20.8512, longitude: 79.3245 }
            ]
          },
          {
            name: 'Katol',
            latitude: 21.2712,
            longitude: 78.5845,
            pincodes: ['441302', '441304'],
            villagesAndTowns: [
              { name: 'Narkhed', type: 'town', pincode: '441304', latitude: 21.3512, longitude: 78.5312 },
              { name: 'Katol Town', type: 'town', pincode: '441302', latitude: 21.2712, longitude: 78.5845 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 7. GUJARAT (West India)
  // =========================================================================
  {
    state: 'Gujarat',
    code: 'GJ',
    region: 'West India',
    capital: 'Gandhinagar',
    districts: [
      {
        name: 'Ahmedabad',
        headquarters: 'Ahmedabad',
        latitude: 23.0225,
        longitude: 72.5714,
        taluks: [
          {
            name: 'Sanand',
            latitude: 22.9845,
            longitude: 72.3812,
            pincodes: ['382110', '382115'],
            villagesAndTowns: [
              { name: 'Nidhrad', type: 'village', pincode: '382110', latitude: 23.0112, longitude: 72.3412 },
              { name: 'Sanand Town', type: 'town', pincode: '382110', latitude: 22.9845, longitude: 72.3812 }
            ]
          },
          {
            name: 'Dholka',
            latitude: 22.7214,
            longitude: 72.4412,
            pincodes: ['382225', '382240'],
            villagesAndTowns: [
              { name: 'Bavla', type: 'town', pincode: '382220', latitude: 22.8312, longitude: 72.3612 },
              { name: 'Dholka Town', type: 'town', pincode: '382225', latitude: 22.7214, longitude: 72.4412 }
            ]
          }
        ]
      },
      {
        name: 'Surat',
        headquarters: 'Surat',
        latitude: 21.1702,
        longitude: 72.8311,
        taluks: [
          {
            name: 'Bardoli',
            latitude: 21.1214,
            longitude: 73.1123,
            pincodes: ['394601', '394602'],
            villagesAndTowns: [
              { name: 'Baben', type: 'village', pincode: '394601', latitude: 21.1345, longitude: 73.1345 },
              { name: 'Bardoli Town', type: 'town', pincode: '394601', latitude: 21.1214, longitude: 73.1123 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 8. UTTAR PRADESH (North India)
  // =========================================================================
  {
    state: 'Uttar Pradesh',
    code: 'UP',
    region: 'North India',
    capital: 'Lucknow',
    districts: [
      {
        name: 'Varanasi',
        headquarters: 'Varanasi',
        latitude: 25.3176,
        longitude: 82.9739,
        taluks: [
          {
            name: 'Pindra',
            latitude: 25.4812,
            longitude: 82.8545,
            pincodes: ['221206', '221204'],
            villagesAndTowns: [
              { name: 'Phulpur Varanasi', type: 'town', pincode: '221206', latitude: 25.5412, longitude: 82.8123 },
              { name: 'Sindhora', type: 'village', pincode: '221208', latitude: 25.5912, longitude: 82.9123 },
              { name: 'Pindra Village', type: 'village', pincode: '221206', latitude: 25.4812, longitude: 82.8545 }
            ]
          },
          {
            name: 'Varanasi Sadar',
            latitude: 25.3176,
            longitude: 82.9739,
            pincodes: ['221001', '221002', '221005'],
            villagesAndTowns: [
              { name: 'Sarnath', type: 'town', pincode: '221007', latitude: 25.3712, longitude: 83.0214 },
              { name: 'Ramnagar UP', type: 'town', pincode: '221008', latitude: 25.2678, longitude: 83.0312 },
              { name: 'Varanasi City', type: 'city', pincode: '221001', latitude: 25.3176, longitude: 82.9739 }
            ]
          }
        ]
      },
      {
        name: 'Lucknow',
        headquarters: 'Lucknow',
        latitude: 26.8467,
        longitude: 80.9462,
        taluks: [
          {
            name: 'Bakshi Ka Talab',
            latitude: 26.9812,
            longitude: 80.8912,
            pincodes: ['226201', '226202'],
            villagesAndTowns: [
              { name: 'Itaunja', type: 'town', pincode: '226203', latitude: 27.0812, longitude: 80.8512 },
              { name: 'Bakshi Ka Talab Town', type: 'town', pincode: '226201', latitude: 26.9812, longitude: 80.8912 }
            ]
          },
          {
            name: 'Mohanlalganj',
            latitude: 26.6812,
            longitude: 80.9912,
            pincodes: ['226301', '226302'],
            villagesAndTowns: [
              { name: 'Gosainganj Lucknow', type: 'town', pincode: '226501', latitude: 26.7712, longitude: 81.1214 },
              { name: 'Mohanlalganj Town', type: 'town', pincode: '226301', latitude: 26.6812, longitude: 80.9912 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 9. WEST BENGAL (East India)
  // =========================================================================
  {
    state: 'West Bengal',
    code: 'WB',
    region: 'East India',
    capital: 'Kolkata',
    districts: [
      {
        name: 'Darjeeling',
        headquarters: 'Darjeeling',
        latitude: 27.041,
        longitude: 88.2663,
        taluks: [
          {
            name: 'Siliguri (Sub-Division)',
            latitude: 26.7271,
            longitude: 88.3953,
            pincodes: ['734001', '734004', '734011'],
            villagesAndTowns: [
              { name: 'Matigara', type: 'town', pincode: '734010', latitude: 26.7112, longitude: 88.3712 },
              { name: 'Naxalbari', type: 'town', pincode: '734429', latitude: 26.6812, longitude: 88.2123 },
              { name: 'Siliguri City', type: 'city', pincode: '734001', latitude: 26.7271, longitude: 88.3953 }
            ]
          }
        ]
      },
      {
        name: 'Kolkata',
        headquarters: 'Kolkata',
        latitude: 22.5726,
        longitude: 88.3639,
        taluks: [
          {
            name: 'Kolkata Central',
            latitude: 22.5726,
            longitude: 88.3639,
            pincodes: ['700001', '700012', '700071'],
            villagesAndTowns: [
              { name: 'Alipore', type: 'city', pincode: '700027', latitude: 22.5312, longitude: 88.3312 },
              { name: 'Salt Lake City', type: 'city', pincode: '700091', latitude: 22.5867, longitude: 88.4178 },
              { name: 'Kolkata City', type: 'city', pincode: '700001', latitude: 22.5726, longitude: 88.3639 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 10. RAJASTHAN (North India)
  // =========================================================================
  {
    state: 'Rajasthan',
    code: 'RJ',
    region: 'North India',
    capital: 'Jaipur',
    districts: [
      {
        name: 'Jaipur',
        headquarters: 'Jaipur',
        latitude: 26.9124,
        longitude: 75.7873,
        taluks: [
          {
            name: 'Amer (Amber)',
            latitude: 26.9856,
            longitude: 75.8512,
            pincodes: ['302028', '303104'],
            villagesAndTowns: [
              { name: 'Kukas', type: 'village', pincode: '302028', latitude: 27.0412, longitude: 75.8912 },
              { name: 'Amer Town', type: 'town', pincode: '302028', latitude: 26.9856, longitude: 75.8512 }
            ]
          },
          {
            name: 'Sanganer',
            latitude: 26.8189,
            longitude: 75.7712,
            pincodes: ['302029', '303902'],
            villagesAndTowns: [
              { name: 'Watika', type: 'village', pincode: '303905', latitude: 26.7112, longitude: 75.7912 },
              { name: 'Sanganer Town', type: 'town', pincode: '302029', latitude: 26.8189, longitude: 75.7712 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 11. BIHAR (East India)
  // =========================================================================
  {
    state: 'Bihar',
    code: 'BR',
    region: 'East India',
    capital: 'Patna',
    districts: [
      {
        name: 'Patna',
        headquarters: 'Patna',
        latitude: 25.5941,
        longitude: 85.1376,
        taluks: [
          {
            name: 'Danapur',
            latitude: 25.6312,
            longitude: 85.0412,
            pincodes: ['801503', '801502'],
            villagesAndTowns: [
              { name: 'Khagaul', type: 'town', pincode: '801105', latitude: 25.5812, longitude: 85.0456 },
              { name: 'Danapur Cantt', type: 'town', pincode: '801503', latitude: 25.6312, longitude: 85.0412 }
            ]
          },
          {
            name: 'Barh',
            latitude: 25.4812,
            longitude: 85.7123,
            pincodes: ['803213', '803214'],
            villagesAndTowns: [
              { name: 'Bakhtiyarpur', type: 'town', pincode: '803212', latitude: 25.4512, longitude: 85.5312 },
              { name: 'Barh Town', type: 'town', pincode: '803213', latitude: 25.4812, longitude: 85.7123 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 12. MADHYA PRADESH (Central India)
  // =========================================================================
  {
    state: 'Madhya Pradesh',
    code: 'MP',
    region: 'Central India',
    capital: 'Bhopal',
    districts: [
      {
        name: 'Indore',
        headquarters: 'Indore',
        latitude: 22.7196,
        longitude: 75.8577,
        taluks: [
          {
            name: 'Mhow (Dr. Ambedkar Nagar)',
            latitude: 22.5545,
            longitude: 75.7645,
            pincodes: ['453441', '453446'],
            villagesAndTowns: [
              { name: 'Pithampur Rural', type: 'town', pincode: '454775', latitude: 22.6123, longitude: 75.6912 },
              { name: 'Mhow Cantt', type: 'town', pincode: '453441', latitude: 22.5545, longitude: 75.7645 }
            ]
          },
          {
            name: 'Sanwer',
            latitude: 22.9789,
            longitude: 75.8312,
            pincodes: ['453551', '453552'],
            villagesAndTowns: [
              { name: 'Kshipra', type: 'village', pincode: '453771', latitude: 22.9123, longitude: 75.9812 },
              { name: 'Sanwer Town', type: 'town', pincode: '453551', latitude: 22.9789, longitude: 75.8312 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 13. PUNJAB (North India)
  // =========================================================================
  {
    state: 'Punjab',
    code: 'PB',
    region: 'North India',
    capital: 'Chandigarh',
    districts: [
      {
        name: 'Amritsar',
        headquarters: 'Amritsar',
        latitude: 31.634,
        longitude: 74.8723,
        taluks: [
          {
            name: 'Ajnala',
            latitude: 31.8412,
            longitude: 74.7612,
            pincodes: ['143102', '143103'],
            villagesAndTowns: [
              { name: 'Chogawan', type: 'village', pincode: '143109', latitude: 31.7412, longitude: 74.6512 },
              { name: 'Ajnala Town', type: 'town', pincode: '143102', latitude: 31.8412, longitude: 74.7612 }
            ]
          },
          {
            name: 'Baba Bakala',
            latitude: 31.5612,
            longitude: 75.2612,
            pincodes: ['143201', '143202'],
            villagesAndTowns: [
              { name: 'Rayya', type: 'town', pincode: '143112', latitude: 31.5412, longitude: 75.2312 },
              { name: 'Baba Bakala Town', type: 'town', pincode: '143201', latitude: 31.5612, longitude: 75.2612 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 14. ODISHA (East India)
  // =========================================================================
  {
    state: 'Odisha',
    code: 'OD',
    region: 'East India',
    capital: 'Bhubaneswar',
    districts: [
      {
        name: 'Khordha',
        headquarters: 'Bhubaneswar',
        latitude: 20.2961,
        longitude: 85.8245,
        taluks: [
          {
            name: 'Jatani',
            latitude: 20.1612,
            longitude: 85.7012,
            pincodes: ['752050', '752054'],
            villagesAndTowns: [
              { name: 'Khurda Road', type: 'town', pincode: '752050', latitude: 20.1712, longitude: 75.7123 },
              { name: 'Jatani Town', type: 'town', pincode: '752050', latitude: 20.1612, longitude: 85.7012 }
            ]
          },
          {
            name: 'Bhubaneswar Taluk',
            latitude: 20.2961,
            longitude: 85.8245,
            pincodes: ['751001', '751024'],
            villagesAndTowns: [
              { name: 'Patia', type: 'city', pincode: '751024', latitude: 20.3545, longitude: 85.8178 },
              { name: 'Bhubaneswar City', type: 'city', pincode: '751001', latitude: 20.2961, longitude: 85.8245 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 15. DELHI (National Capital Territory)
  // =========================================================================
  {
    state: 'Delhi',
    code: 'DL',
    region: 'North India',
    capital: 'New Delhi',
    districts: [
      {
        name: 'Central Delhi',
        headquarters: 'New Delhi',
        latitude: 28.6139,
        longitude: 77.209,
        taluks: [
          {
            name: 'Connaught Place (Sub-Division)',
            latitude: 28.6315,
            longitude: 77.2167,
            pincodes: ['110001', '110002'],
            villagesAndTowns: [
              { name: 'Connaught Place', type: 'city', pincode: '110001', latitude: 28.6315, longitude: 77.2167 },
              { name: 'Daryaganj', type: 'city', pincode: '110002', latitude: 28.6412, longitude: 77.2412 }
            ]
          }
        ]
      },
      {
        name: 'South West Delhi',
        headquarters: 'Dwarka',
        latitude: 28.5921,
        longitude: 77.046,
        taluks: [
          {
            name: 'Najafgarh',
            latitude: 28.6089,
            longitude: 76.9812,
            pincodes: ['110043', '110071'],
            villagesAndTowns: [
              { name: 'Dichaon Kalan', type: 'village', pincode: '110043', latitude: 28.6312, longitude: 76.9612 },
              { name: 'Chhawla', type: 'village', pincode: '110071', latitude: 28.5612, longitude: 77.0123 },
              { name: 'Najafgarh Town', type: 'town', pincode: '110043', latitude: 28.6089, longitude: 76.9812 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 16. ASSAM (North-East India)
  // =========================================================================
  {
    state: 'Assam',
    code: 'AS',
    region: 'North-East India',
    capital: 'Dispur',
    districts: [
      {
        name: 'Kamrup Metropolitan',
        headquarters: 'Guwahati',
        latitude: 26.1445,
        longitude: 91.7362,
        taluks: [
          {
            name: 'Guwahati Circle',
            latitude: 26.1445,
            longitude: 91.7362,
            pincodes: ['781001', '781005', '781006'],
            villagesAndTowns: [
              { name: 'Dispur', type: 'city', pincode: '781006', latitude: 26.1408, longitude: 91.7904 },
              { name: 'Guwahati City', type: 'city', pincode: '781001', latitude: 26.1445, longitude: 91.7362 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 17. HARYANA (North India)
  // =========================================================================
  {
    state: 'Haryana',
    code: 'HR',
    region: 'North India',
    capital: 'Chandigarh',
    districts: [
      {
        name: 'Gurugram',
        headquarters: 'Gurugram',
        latitude: 28.4595,
        longitude: 77.0266,
        taluks: [
          {
            name: 'Sohna',
            latitude: 28.2476,
            longitude: 77.0628,
            pincodes: ['122103', '122102'],
            villagesAndTowns: [
              { name: 'Bhondsi', type: 'village', pincode: '122102', latitude: 28.3512, longitude: 77.0512 },
              { name: 'Sohna Town', type: 'town', pincode: '122103', latitude: 28.2476, longitude: 77.0628 }
            ]
          },
          {
            name: 'Pataudi',
            latitude: 28.3214,
            longitude: 76.7812,
            pincodes: ['122503', '122504'],
            villagesAndTowns: [
              { name: 'Haileymandi', type: 'town', pincode: '122504', latitude: 28.3612, longitude: 76.7912 },
              { name: 'Pataudi Town', type: 'town', pincode: '122503', latitude: 28.3214, longitude: 76.7812 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 18. JHARKHAND (East India)
  // =========================================================================
  {
    state: 'Jharkhand',
    code: 'JH',
    region: 'East India',
    capital: 'Ranchi',
    districts: [
      {
        name: 'Ranchi',
        headquarters: 'Ranchi',
        latitude: 23.3441,
        longitude: 85.3096,
        taluks: [
          {
            name: 'Kanke',
            latitude: 23.4312,
            longitude: 85.3214,
            pincodes: ['834006', '834008'],
            villagesAndTowns: [
              { name: 'Arsande', type: 'village', pincode: '834006', latitude: 23.4214, longitude: 85.3123 },
              { name: 'Kanke Town', type: 'town', pincode: '834006', latitude: 23.4312, longitude: 85.3214 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 19. CHHATTISGARH (Central India)
  // =========================================================================
  {
    state: 'Chhattisgarh',
    code: 'CG',
    region: 'Central India',
    capital: 'Raipur',
    districts: [
      {
        name: 'Raipur',
        headquarters: 'Raipur',
        latitude: 21.2514,
        longitude: 81.6296,
        taluks: [
          {
            name: 'Arang',
            latitude: 21.1912,
            longitude: 81.9612,
            pincodes: ['493441', '493442'],
            villagesAndTowns: [
              { name: 'Mandir Hasaud', type: 'village', pincode: '492101', latitude: 21.2312, longitude: 81.7812 },
              { name: 'Arang Town', type: 'town', pincode: '493441', latitude: 21.1912, longitude: 81.9612 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 20. HIMACHAL PRADESH (North India)
  // =========================================================================
  {
    state: 'Himachal Pradesh',
    code: 'HP',
    region: 'North India',
    capital: 'Shimla',
    districts: [
      {
        name: 'Shimla',
        headquarters: 'Shimla',
        latitude: 31.1048,
        longitude: 77.1734,
        taluks: [
          {
            name: 'Theog',
            latitude: 31.1214,
            longitude: 77.3512,
            pincodes: ['171201', '171209'],
            villagesAndTowns: [
              { name: 'Fagu', type: 'village', pincode: '171209', latitude: 31.0912, longitude: 77.2912 },
              { name: 'Theog Town', type: 'town', pincode: '171201', latitude: 31.1214, longitude: 77.3512 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 21. UTTARAKHAND (North India)
  // =========================================================================
  {
    state: 'Uttarakhand',
    code: 'UK',
    region: 'North India',
    capital: 'Dehradun',
    districts: [
      {
        name: 'Dehradun',
        headquarters: 'Dehradun',
        latitude: 30.3165,
        longitude: 78.0322,
        taluks: [
          {
            name: 'Rishikesh',
            latitude: 30.0869,
            longitude: 78.2676,
            pincodes: ['249201', '249202'],
            villagesAndTowns: [
              { name: 'Raiwala', type: 'village', pincode: '249205', latitude: 30.0123, longitude: 78.2145 },
              { name: 'Rishikesh Town', type: 'town', pincode: '249201', latitude: 30.0869, longitude: 78.2676 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 22. GOA (West India)
  // =========================================================================
  {
    state: 'Goa',
    code: 'GA',
    region: 'West India',
    capital: 'Panaji',
    districts: [
      {
        name: 'North Goa',
        headquarters: 'Panaji',
        latitude: 15.4909,
        longitude: 73.8278,
        taluks: [
          {
            name: 'Bardez',
            latitude: 15.5845,
            longitude: 73.8123,
            pincodes: ['403507', '403515'],
            villagesAndTowns: [
              { name: 'Mapusa', type: 'town', pincode: '403507', latitude: 15.5989, longitude: 73.8123 },
              { name: 'Calangute', type: 'town', pincode: '403516', latitude: 15.5412, longitude: 73.7567 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 23. JAMMU & KASHMIR (North India)
  // =========================================================================
  {
    state: 'Jammu & Kashmir',
    code: 'JK',
    region: 'North India',
    capital: 'Srinagar',
    districts: [
      {
        name: 'Srinagar',
        headquarters: 'Srinagar',
        latitude: 34.0837,
        longitude: 74.7973,
        taluks: [
          {
            name: 'Srinagar South',
            latitude: 34.0512,
            longitude: 74.8214,
            pincodes: ['190001', '190008'],
            villagesAndTowns: [
              { name: 'Lal Chowk', type: 'city', pincode: '190001', latitude: 34.0712, longitude: 74.8112 },
              { name: 'Srinagar City', type: 'city', pincode: '190001', latitude: 34.0837, longitude: 74.7973 }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 24. TRIPURA (North-East India)
  // =========================================================================
  {
    state: 'Tripura',
    code: 'TR',
    region: 'North-East India',
    capital: 'Agartala',
    districts: [
      {
        name: 'West Tripura',
        headquarters: 'Agartala',
        latitude: 23.8315,
        longitude: 91.2868,
        taluks: [
          {
            name: 'Sadar Agartala',
            latitude: 23.8315,
            longitude: 91.2868,
            pincodes: ['799001', '799002'],
            villagesAndTowns: [
              { name: 'Ranirbazar', type: 'town', pincode: '799035', latitude: 23.8412, longitude: 91.3612 },
              { name: 'Agartala City', type: 'city', pincode: '799001', latitude: 23.8315, longitude: 91.2868 }
            ]
          }
        ]
      }
    ]
  }
];

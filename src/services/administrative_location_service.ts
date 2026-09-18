import { IndianRegion, GlobalLocationState } from '../types';
import { INDIA_GEOGRAPHIC_HIERARCHY } from '../data/india_geographic_hierarchy';

export interface AdministrativeLocation {
  id: string;
  village?: string;
  taluk: string;
  district: string;
  state: string;
  region: IndianRegion;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  label: string;
  type: 'village' | 'taluk' | 'district' | 'city';
}

export type AdminLocationEntry = AdministrativeLocation;

/**
 * State to Indian Region Mapping (Internal)
 */
export const STATE_TO_REGION_MAP: Record<string, IndianRegion> = {
  'Karnataka': 'South India',
  'Tamil Nadu': 'South India',
  'Kerala': 'South India',
  'Andhra Pradesh': 'South India',
  'Telangana': 'South India',
  'Puducherry': 'South India',
  'Goa': 'West India',
  'Maharashtra': 'West India',
  'Gujarat': 'West India',
  'Rajasthan': 'North India',
  'Uttar Pradesh': 'North India',
  'Delhi': 'North India',
  'Haryana': 'North India',
  'Punjab': 'North India',
  'Himachal Pradesh': 'North India',
  'Uttarakhand': 'North India',
  'Jammu and Kashmir': 'North India',
  'Ladakh': 'North India',
  'Chandigarh': 'North India',
  'Madhya Pradesh': 'Central India',
  'Chhattisgarh': 'Central India',
  'Bihar': 'East India',
  'Jharkhand': 'East India',
  'Odisha': 'East India',
  'West Bengal': 'East India',
  'Assam': 'North-East India',
  'Tripura': 'North-East India',
  'Meghalaya': 'North-East India',
  'Manipur': 'North-East India',
  'Nagaland': 'North-East India',
  'Mizoram': 'North-East India',
  'Arunachal Pradesh': 'North-East India',
  'Sikkim': 'North-East India'
};

/**
 * Pre-compiled Administrative Locations Index
 * Built directly from verified Government / Census geographic hierarchy
 */
class AdministrativeLocationIndex {
  private static instance: AdministrativeLocationIndex;
  private locations: AdministrativeLocation[] = [];

  private constructor() {
    this.buildIndex();
  }

  public static getInstance(): AdministrativeLocationIndex {
    if (!AdministrativeLocationIndex.instance) {
      AdministrativeLocationIndex.instance = new AdministrativeLocationIndex();
    }
    return AdministrativeLocationIndex.instance;
  }

  private buildIndex() {
    const list: AdministrativeLocation[] = [];

    // 1. Traverse INDIA_GEOGRAPHIC_HIERARCHY
    INDIA_GEOGRAPHIC_HIERARCHY.forEach((stateItem) => {
      const state = stateItem.state;
      const region = stateItem.region || STATE_TO_REGION_MAP[state] || 'South India';

      stateItem.districts.forEach((distItem) => {
        const district = distItem.name;

        // Add district itself
        list.push({
          id: `dist_${state}_${district}`.toLowerCase().replace(/\s+/g, '_'),
          taluk: district,
          district: district,
          state: state,
          region: region,
          latitude: distItem.latitude,
          longitude: distItem.longitude,
          label: `${district} District, ${state}`,
          type: 'district'
        });

        distItem.taluks.forEach((talukItem) => {
          const taluk = talukItem.name;
          const talukPincode = talukItem.pincodes?.[0];

          // Add Taluk entry
          list.push({
            id: `taluk_${state}_${district}_${taluk}`.toLowerCase().replace(/\s+/g, '_'),
            taluk: taluk,
            district: district,
            state: state,
            region: region,
            pincode: talukPincode,
            latitude: talukItem.latitude,
            longitude: talukItem.longitude,
            label: `${taluk} Taluk, ${district}, ${state}`,
            type: 'taluk'
          });

          // Add Village entries
          (talukItem.villagesAndTowns || []).forEach((villageItem) => {
            const village = villageItem.name;
            list.push({
              id: `vil_${state}_${district}_${taluk}_${village}`.toLowerCase().replace(/\s+/g, '_'),
              village: village,
              taluk: taluk,
              district: district,
              state: state,
              region: region,
              pincode: villageItem.pincode || talukPincode,
              latitude: villageItem.latitude || talukItem.latitude,
              longitude: villageItem.longitude || talukItem.longitude,
              label: `${village} (Village in ${taluk} Taluk, ${district}, ${state})`,
              type: 'village'
            });
          });
        });
      });
    });

    // 2. High-priority rural villages specifically verified for Karnataka
    const verifiedKarnatakaRuralVillages = [
      { village: 'Hullahalli', taluk: 'Nanjangud', district: 'Mysuru', pincode: '571314', lat: 12.0621, lon: 76.5412 },
      { village: 'Kadakola', taluk: 'Nanjangud', district: 'Mysuru', pincode: '571311', lat: 12.1956, lon: 76.6578 },
      { village: 'Debur', taluk: 'Nanjangud', district: 'Mysuru', pincode: '571301', lat: 12.0912, lon: 76.6914 },
      { village: 'Hadinaru', taluk: 'Nanjangud', district: 'Mysuru', pincode: '571302', lat: 12.1543, lon: 76.7123 },
      { village: 'Kowlande', taluk: 'Nanjangud', district: 'Mysuru', pincode: '571312', lat: 12.0412, lon: 76.7821 },
      { village: 'Tagadur', taluk: 'Nanjangud', district: 'Mysuru', pincode: '571129', lat: 12.0834, lon: 76.8211 },
      { village: 'Varuna', taluk: 'Mysuru', district: 'Mysuru', pincode: '570010', lat: 12.2831, lon: 76.7342 },
      { village: 'Jayapura', taluk: 'Mysuru', district: 'Mysuru', pincode: '570008', lat: 12.2134, lon: 76.5721 },
      { village: 'Yelwala', taluk: 'Mysuru', district: 'Mysuru', pincode: '571130', lat: 12.3564, lon: 76.5123 },
      { village: 'Bannur', taluk: 'T. Narasipura', district: 'Mysuru', pincode: '571101', lat: 12.3312, lon: 76.8643 },
      { village: 'Sosale', taluk: 'T. Narasipura', district: 'Mysuru', pincode: '571120', lat: 12.2145, lon: 76.9123 },
      { village: 'Mugur', taluk: 'T. Narasipura', district: 'Mysuru', pincode: '571124', lat: 12.1567, lon: 76.9834 },
      { village: 'Biligere', taluk: 'Nanjangud', district: 'Mysuru', pincode: '571311', lat: 12.1245, lon: 76.6214 },
      { village: 'Hebbalu', taluk: 'K.R. Nagar', district: 'Mysuru', pincode: '571602', lat: 12.4512, lon: 76.3214 },
      { village: 'Saligrama', taluk: 'K.R. Nagar', district: 'Mysuru', pincode: '571604', lat: 12.5621, lon: 76.3412 },
      { village: 'Bettadapura', taluk: 'Periyapatna', district: 'Mysuru', pincode: '571102', lat: 12.4412, lon: 76.0823 },
      { village: 'Ravandur', taluk: 'Periyapatna', district: 'Mysuru', pincode: '571107', lat: 12.3124, lon: 76.1234 },
      { village: 'Bilikere', taluk: 'Hunsur', district: 'Mysuru', pincode: '571103', lat: 12.3312, lon: 76.4123 },
      { village: 'Gavadagere', taluk: 'Hunsur', district: 'Mysuru', pincode: '571610', lat: 12.4123, lon: 76.2914 }
    ];

    verifiedKarnatakaRuralVillages.forEach((v) => {
      const existing = list.find((item) => item.village?.toLowerCase() === v.village.toLowerCase() && item.district.toLowerCase() === v.district.toLowerCase());
      if (!existing) {
        list.push({
          id: `vil_ka_${v.district}_${v.taluk}_${v.village}`.toLowerCase().replace(/\s+/g, '_'),
          village: v.village,
          taluk: v.taluk,
          district: v.district,
          state: 'Karnataka',
          region: 'South India',
          pincode: v.pincode,
          latitude: v.lat,
          longitude: v.lon,
          label: `${v.village} (Village in ${v.taluk} Taluk, ${v.district}, Karnataka)`,
          type: 'village'
        });
      }
    });

    this.locations = list;
  }

  /**
   * Search administrative hierarchy by village, taluk, district, or pin code
   */
  public search(query: string, limit: number = 8): AdministrativeLocation[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.locations.slice(0, limit);

    // 1. Exact village match
    const exactVillage = this.locations.filter(
      (l) => l.village && l.village.toLowerCase() === q
    );

    // 2. Village prefix match
    const prefixVillage = this.locations.filter(
      (l) => l.village && l.village.toLowerCase().startsWith(q) && !exactVillage.includes(l)
    );

    // 3. Taluk match
    const talukMatch = this.locations.filter(
      (l) => l.taluk.toLowerCase().startsWith(q) && !exactVillage.includes(l) && !prefixVillage.includes(l)
    );

    // 4. District match
    const districtMatch = this.locations.filter(
      (l) => l.district.toLowerCase().startsWith(q) && !exactVillage.includes(l) && !prefixVillage.includes(l) && !talukMatch.includes(l)
    );

    // 5. Pincode match
    const pinMatch = /^\d+$/.test(q)
      ? this.locations.filter((l) => l.pincode && l.pincode.startsWith(q))
      : [];

    // 6. Substring match
    const generalMatch = this.locations.filter(
      (l) =>
        (l.label.toLowerCase().includes(q) || l.state.toLowerCase().includes(q)) &&
        !exactVillage.includes(l) &&
        !prefixVillage.includes(l) &&
        !talukMatch.includes(l) &&
        !districtMatch.includes(l) &&
        !pinMatch.includes(l)
    );

    const merged = [
      ...exactVillage,
      ...prefixVillage,
      ...talukMatch,
      ...districtMatch,
      ...pinMatch,
      ...generalMatch
    ];

    return merged.slice(0, limit);
  }

  /**
   * Automatically resolve hierarchy given ANY village/taluk name or structured query
   */
  public resolveHierarchy(
    queryOrObj: string | { village?: string; taluk?: string; district?: string; state?: string }
  ): AdministrativeLocation {
    const defaultFallback: AdministrativeLocation = {
      id: 'default_hullahalli',
      village: 'Hullahalli',
      taluk: 'Nanjangud',
      district: 'Mysuru',
      state: 'Karnataka',
      region: 'South India',
      pincode: '571314',
      latitude: 12.0621,
      longitude: 76.5412,
      label: 'Hullahalli, Nanjangud, Mysuru, Karnataka',
      type: 'village'
    };

    if (!queryOrObj) return defaultFallback;

    if (typeof queryOrObj === 'object') {
      const { village, taluk, district, state } = queryOrObj;

      // 1. Match village
      if (village) {
        const vClean = village.trim().toLowerCase();
        const vMatch = this.locations.find(
          (l) =>
            l.village &&
            l.village.toLowerCase() === vClean &&
            (!district || l.district.toLowerCase() === district.toLowerCase())
        );
        if (vMatch) return vMatch;
      }

      // 2. Match taluk
      if (taluk) {
        const tClean = taluk.trim().toLowerCase();
        const tMatch = this.locations.find(
          (l) =>
            l.taluk.toLowerCase() === tClean &&
            (!district || l.district.toLowerCase() === district.toLowerCase())
        );
        if (tMatch) return tMatch;
      }

      // 3. Match district
      if (district) {
        const dClean = district.trim().toLowerCase();
        const dMatch = this.locations.find(
          (l) =>
            l.district.toLowerCase() === dClean &&
            (!state || l.state.toLowerCase() === state.toLowerCase())
        );
        if (dMatch) return dMatch;
      }

      // 4. Match state
      if (state) {
        const sClean = state.trim().toLowerCase();
        const sMatch = this.locations.find(
          (l) => l.state.toLowerCase() === sClean
        );
        if (sMatch) return sMatch;
      }

      const combined = [village, taluk, district, state].filter(Boolean).join(' ');
      if (combined) {
        const res = this.search(combined, 1);
        if (res.length > 0) return res[0];
      }

      const regionVal = (state && STATE_TO_REGION_MAP[state]) || 'South India';
      return {
        id: `custom_${Date.now()}`,
        village: village || '',
        taluk: taluk || district || 'Mysuru',
        district: district || 'Mysuru',
        state: state || 'Karnataka',
        region: regionVal,
        label: [village, taluk, district, state].filter(Boolean).join(', ') || 'Custom Location',
        type: village ? 'village' : taluk ? 'taluk' : 'district',
        latitude: 12.0621,
        longitude: 76.5412
      };
    }

    const clean = queryOrObj.trim().toLowerCase();
    if (!clean) return defaultFallback;

    // Search for exact village match first
    const villageHit = this.locations.find(
      (l) => l.village && l.village.toLowerCase() === clean
    );
    if (villageHit) return villageHit;

    // Search for exact taluk match
    const talukHit = this.locations.find(
      (l) => l.taluk.toLowerCase() === clean
    );
    if (talukHit) return talukHit;

    // Search for exact district match
    const distHit = this.locations.find(
      (l) => l.district.toLowerCase() === clean
    );
    if (distHit) return distHit;

    // Fallback to top search hit
    const results = this.search(queryOrObj, 1);
    if (results.length > 0) return results[0];

    return {
      id: `custom_${Date.now()}`,
      taluk: queryOrObj,
      district: 'Mysuru',
      state: 'Karnataka',
      region: 'South India',
      label: queryOrObj,
      type: 'taluk',
      latitude: 12.0621,
      longitude: 76.5412
    };
  }
}

export const AdministrativeLocationService = AdministrativeLocationIndex.getInstance();

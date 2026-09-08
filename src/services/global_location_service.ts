import { GlobalLocationState, IndianRegion } from '../types';
import {
  INDIA_GEOGRAPHIC_HIERARCHY,
  StateData,
  DistrictData,
  TalukData,
  VillageTownData
} from '../data/india_geographic_hierarchy';

export interface LocationCityData {
  city: string;
  district: string;
  state: string;
  taluk?: string;
  village?: string;
  pincode?: string;
  region: IndianRegion;
  latitude: number;
  longitude: number;
}

// Indian States & Union Territories with their corresponding IndianRegion
export const ALL_INDIAN_STATES_REGIONS: Record<string, IndianRegion> = {
  'Karnataka': 'South India',
  'Tamil Nadu': 'South India',
  'Kerala': 'South India',
  'Telangana': 'South India',
  'Andhra Pradesh': 'South India',
  'Maharashtra': 'West India',
  'Gujarat': 'West India',
  'Goa': 'West India',
  'Rajasthan': 'North India',
  'Uttar Pradesh': 'North India',
  'Punjab': 'North India',
  'Haryana': 'North India',
  'Delhi': 'North India',
  'Himachal Pradesh': 'North India',
  'Uttarakhand': 'North India',
  'Jammu & Kashmir': 'North India',
  'Ladakh': 'North India',
  'Chandigarh': 'North India',
  'West Bengal': 'East India',
  'Bihar': 'East India',
  'Odisha': 'East India',
  'Jharkhand': 'East India',
  'Madhya Pradesh': 'Central India',
  'Chhattisgarh': 'Central India',
  'Assam': 'North-East India',
  'Tripura': 'North-East India',
  'Meghalaya': 'North-East India',
  'Manipur': 'North-East India',
  'Nagaland': 'North-East India',
  'Mizoram': 'North-East India',
  'Arunachal Pradesh': 'North-East India',
  'Sikkim': 'North-East India',
  'Puducherry': 'South India',
  'Andaman and Nicobar Islands': 'South India',
  'Dadra and Nagar Haveli and Daman and Diu': 'West India',
  'Lakshadweep': 'South India'
};

// Rural & Urban Sample Locations representing various regions of India
export const POPULAR_INDIAN_LOCATIONS: LocationCityData[] = [
  {
    city: 'Hullahalli',
    village: 'Hullahalli',
    taluk: 'Nanjangud',
    district: 'Mysuru',
    state: 'Karnataka',
    pincode: '571314',
    region: 'South India',
    latitude: 12.0621,
    longitude: 76.5412
  },
  {
    city: 'Nanjangud',
    taluk: 'Nanjangud',
    district: 'Mysuru',
    state: 'Karnataka',
    pincode: '571301',
    region: 'South India',
    latitude: 12.1197,
    longitude: 76.6786
  },
  {
    city: 'Mysuru',
    district: 'Mysuru',
    state: 'Karnataka',
    pincode: '570001',
    region: 'South India',
    latitude: 12.2958,
    longitude: 76.6394
  },
  {
    city: 'Pollachi',
    taluk: 'Pollachi',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '642001',
    region: 'South India',
    latitude: 10.6612,
    longitude: 77.0089
  },
  {
    city: 'Aluva',
    taluk: 'Aluva',
    district: 'Ernakulam',
    state: 'Kerala',
    pincode: '683101',
    region: 'South India',
    latitude: 10.1076,
    longitude: 76.3516
  },
  {
    city: 'Baramati',
    taluk: 'Baramati',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '413102',
    region: 'West India',
    latitude: 18.1516,
    longitude: 74.5768
  },
  {
    city: 'Pindra',
    village: 'Pindra',
    taluk: 'Pindra',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    pincode: '221206',
    region: 'North India',
    latitude: 25.4812,
    longitude: 82.8545
  },
  {
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    pincode: '560001',
    region: 'South India',
    latitude: 12.9716,
    longitude: 77.5946
  },
  {
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    region: 'South India',
    latitude: 13.0827,
    longitude: 80.2707
  },
  {
    city: 'Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    region: 'South India',
    latitude: 17.385,
    longitude: 78.4867
  }
];

export const DEFAULT_GLOBAL_LOCATION: GlobalLocationState = {
  country: 'India',
  state: 'Karnataka',
  district: 'Mysuru',
  taluk: 'Nanjangud',
  village: 'Hullahalli',
  townOrVillage: 'Hullahalli',
  city: 'Hullahalli',
  pincode: '571314',
  locality: 'Hullahalli Gram Panchayat',
  formattedAddress: 'Hullahalli Village, Nanjangud Taluk, Mysuru District, Karnataka - 571314',
  latitude: 12.0621,
  longitude: 76.5412,
  region: 'South India',
  locationType: 'village',
  isGpsDetected: false
};

const STORAGE_KEY = 'pregnutri_global_location_v3';

/**
 * Service to manage centralized location state across all application modules,
 * supporting GPS auto-detection, cascading rural dropdowns, PIN code search, and dynamic geocoding.
 */
export class GlobalLocationService {
  private static instance: GlobalLocationService;
  private currentLocation: GlobalLocationState;
  private listeners: ((loc: GlobalLocationState) => void)[] = [];

  private constructor() {
    this.currentLocation = this.loadFromStorage();
  }

  public static getInstance(): GlobalLocationService {
    if (!GlobalLocationService.instance) {
      GlobalLocationService.instance = new GlobalLocationService();
    }
    return GlobalLocationService.instance;
  }

  // Static convenience wrappers
  public static getLocation(): GlobalLocationState {
    return GlobalLocationService.getInstance().getLocation();
  }

  public static setLocation(newLoc: Partial<GlobalLocationState>): GlobalLocationState {
    return GlobalLocationService.getInstance().setLocation(newLoc);
  }

  public static subscribe(fn: (loc: GlobalLocationState) => void): () => void {
    return GlobalLocationService.getInstance().subscribe(fn);
  }

  public static getRegionForState(stateName: string): IndianRegion {
    return GlobalLocationService.getInstance().getRegionForState(stateName);
  }

  public static formatDisplay(loc: Partial<GlobalLocationState>, format: 'full' | 'short' | 'medium' = 'medium'): string {
    return GlobalLocationService.getInstance().formatLocationDisplay(loc, format);
  }

  public static async searchUniversal(query: string): Promise<GlobalLocationState[]> {
    return GlobalLocationService.getInstance().searchUniversal(query);
  }

  public static async searchLocationsUniversal(query: string): Promise<GlobalLocationState[]> {
    return GlobalLocationService.getInstance().searchUniversal(query);
  }

  public async searchLocationsUniversal(query: string): Promise<GlobalLocationState[]> {
    return this.searchUniversal(query);
  }

  private loadFromStorage(): GlobalLocationState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_GLOBAL_LOCATION;
  }

  public getLocation(): GlobalLocationState {
    return { ...this.currentLocation };
  }

  public setLocation(newLoc: Partial<GlobalLocationState>): GlobalLocationState {
    const region = newLoc.region || (newLoc.state ? this.getRegionForState(newLoc.state) : this.currentLocation.region);

    const cityOrLocality =
      newLoc.village ||
      newLoc.townOrVillage ||
      newLoc.city ||
      newLoc.taluk ||
      newLoc.district ||
      this.currentLocation.city;

    const formattedAddress =
      newLoc.formattedAddress ||
      this.formatLocationDisplay(
        {
          village: newLoc.village,
          townOrVillage: newLoc.townOrVillage,
          taluk: newLoc.taluk,
          district: newLoc.district,
          state: newLoc.state,
          pincode: newLoc.pincode,
          city: cityOrLocality
        },
        'full'
      );

    const updated: GlobalLocationState = {
      country: 'India',
      state: newLoc.state || this.currentLocation.state,
      district: newLoc.district || this.currentLocation.district,
      taluk: newLoc.taluk !== undefined ? newLoc.taluk : this.currentLocation.taluk,
      village: newLoc.village !== undefined ? newLoc.village : this.currentLocation.village,
      townOrVillage: newLoc.townOrVillage || newLoc.village || newLoc.city || this.currentLocation.townOrVillage,
      city: cityOrLocality,
      pincode: newLoc.pincode || this.currentLocation.pincode,
      locality: newLoc.locality || this.currentLocation.locality,
      formattedAddress,
      latitude: newLoc.latitude ?? this.currentLocation.latitude,
      longitude: newLoc.longitude ?? this.currentLocation.longitude,
      region,
      cuisineRegion: newLoc.cuisineRegion || this.currentLocation.cuisineRegion,
      isGpsDetected: newLoc.isGpsDetected ?? this.currentLocation.isGpsDetected,
      locationType: newLoc.locationType || (newLoc.village ? 'village' : newLoc.taluk ? 'taluk' : 'city')
    };

    this.currentLocation = updated;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage failure ignore
    }

    // Notify all subscribers across the application
    this.listeners.forEach((fn) => fn(updated));
    return updated;
  }

  public subscribe(fn: (loc: GlobalLocationState) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== fn);
    };
  }

  public getRegionForState(stateName: string): IndianRegion {
    if (!stateName) return 'South India';
    const cleanState = stateName.trim();
    for (const [s, reg] of Object.entries(ALL_INDIAN_STATES_REGIONS)) {
      if (cleanState.toLowerCase() === s.toLowerCase()) {
        return reg;
      }
    }
    return 'South India';
  }

  /**
   * Formats a clean, readable location string with hierarchical priority:
   * Village -> Taluk -> District -> State -> PIN code
   */
  public formatLocationDisplay(
    loc: Partial<GlobalLocationState>,
    format: 'full' | 'short' | 'medium' = 'medium'
  ): string {
    const village = loc.village || loc.townOrVillage;
    const taluk = loc.taluk;
    const district = loc.district;
    const state = loc.state;
    const pin = loc.pincode;

    if (format === 'short') {
      if (village && district && village !== district) {
        return `${village}, ${district}`;
      }
      if (taluk && district && taluk !== district) {
        return `${taluk}, ${district}`;
      }
      return `${village || taluk || district || loc.city || 'India'}${state ? `, ${state}` : ''}`;
    }

    if (format === 'medium') {
      const parts: string[] = [];
      if (village) parts.push(village);
      else if (loc.city) parts.push(loc.city);

      if (taluk && taluk !== village && taluk !== district) {
        parts.push(taluk.endsWith('Taluk') || taluk.endsWith('Tehsil') ? taluk : `${taluk} Taluk`);
      }

      if (district && district !== village && district !== taluk) {
        parts.push(district);
      }

      if (state) parts.push(state);

      return parts.join(', ') || 'India';
    }

    // Full format
    const fullParts: string[] = [];
    if (village) {
      fullParts.push(loc.locationType === 'village' ? `${village} Village` : village);
    }
    if (taluk && taluk !== village) {
      fullParts.push(taluk.endsWith('Taluk') || taluk.endsWith('Tehsil') ? taluk : `${taluk} Taluk`);
    }
    if (district && district !== taluk && district !== village) {
      fullParts.push(`${district} District`);
    }
    if (state) {
      fullParts.push(state);
    }
    if (pin) {
      fullParts.push(`PIN: ${pin}`);
    }

    return fullParts.join(', ') || 'India';
  }

  // =========================================================================
  // DATASET QUERY METHODS (Cascading hierarchy)
  // =========================================================================

  public getAllStates(): StateData[] {
    return INDIA_GEOGRAPHIC_HIERARCHY;
  }

  public getStateData(stateName: string): StateData | undefined {
    return INDIA_GEOGRAPHIC_HIERARCHY.find(
      (s) => s.state.toLowerCase() === stateName.toLowerCase()
    );
  }

  public getDistrictsForState(stateName: string): DistrictData[] {
    const st = this.getStateData(stateName);
    return st ? st.districts : [];
  }

  public getTaluksForDistrict(stateName: string, districtName: string): TalukData[] {
    const st = this.getStateData(stateName);
    if (!st) return [];
    const dist = st.districts.find(
      (d) => d.name.toLowerCase() === districtName.toLowerCase()
    );
    return dist ? dist.taluks : [];
  }

  public getVillagesForTaluk(
    stateName: string,
    districtName: string,
    talukName: string
  ): VillageTownData[] {
    const taluks = this.getTaluksForDistrict(stateName, districtName);
    const tal = taluks.find(
      (t) => t.name.toLowerCase() === talukName.toLowerCase()
    );
    return tal ? tal.villagesAndTowns : [];
  }

  // =========================================================================
  // LIVE REVERSE GEOCODING (GPS -> Rural Village / Taluk / District / State)
  // =========================================================================

  /**
   * Accurately converts GPS coordinates into rural hierarchy:
   * Village -> Taluk/Tehsil -> District -> State -> PIN Code
   */
  public async resolveGpsCoordinates(
    lat: number,
    lng: number
  ): Promise<GlobalLocationState> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'PregNutriAI-RuralLocationEngine/1.0'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const address = data.address || {};

        const state = address.state || 'Karnataka';
        const district = address.state_district || address.district || address.county || 'Mysuru';
        
        // Deep rural resolution - prioritize village/hamlet/isolated settlement
        const rawVillage =
          address.village ||
          address.hamlet ||
          address.isolated_dwelling ||
          address.croft ||
          address.farm ||
          address.neighbourhood ||
          address.suburb;

        const rawTaluk =
          address.subdistrict ||
          address.tehsil ||
          address.taluk ||
          address.mandal ||
          address.district_subdivision ||
          address.county;

        const rawTown = address.town || address.city || address.municipality;

        const pincode = address.postcode ? address.postcode.replace(/\D/g, '').slice(0, 6) : undefined;

        const village = rawVillage || rawTown || undefined;
        const taluk = rawTaluk || undefined;
        const city = village || taluk || district || rawTown || 'Detected Location';
        const region = this.getRegionForState(state);

        const detectedState: GlobalLocationState = {
          country: 'India',
          state,
          district,
          taluk,
          village,
          townOrVillage: village || rawTown,
          city,
          pincode,
          locality: address.suburb || address.neighbourhood || village,
          latitude: Number(lat.toFixed(4)),
          longitude: Number(lng.toFixed(4)),
          region,
          isGpsDetected: true,
          locationType: rawVillage ? 'village' : taluk ? 'taluk' : 'city'
        };

        detectedState.formattedAddress = this.formatLocationDisplay(detectedState, 'full');
        return detectedState;
      }
    } catch (e) {
      console.warn('Live reverse geocoding request encountered error, using spatial fallback:', e);
    }

    // Spatial Fallback: Calculate nearest point in geographic dataset
    let closestMatch = DEFAULT_GLOBAL_LOCATION;
    let minDistance = Infinity;

    for (const st of INDIA_GEOGRAPHIC_HIERARCHY) {
      for (const dist of st.districts) {
        for (const tal of dist.taluks) {
          for (const vt of tal.villagesAndTowns) {
            const vLat = vt.latitude || tal.latitude;
            const vLng = vt.longitude || tal.longitude;
            const distKm = Math.hypot(vLat - lat, vLng - lng);
            if (distKm < minDistance) {
              minDistance = distKm;
              closestMatch = {
                country: 'India',
                state: st.state,
                district: dist.name,
                taluk: tal.name,
                village: vt.type === 'village' || vt.type === 'gram_panchayat' ? vt.name : undefined,
                townOrVillage: vt.name,
                city: vt.name,
                pincode: vt.pincode || tal.pincodes?.[0],
                latitude: Number(lat.toFixed(4)),
                longitude: Number(lng.toFixed(4)),
                region: st.region,
                isGpsDetected: true,
                locationType: vt.type
              };
            }
          }
        }
      }
    }

    closestMatch.formattedAddress = this.formatLocationDisplay(closestMatch, 'full');
    return closestMatch;
  }

  // =========================================================================
  // PIN CODE LOOKUP (India Post & Embedded Database)
  // =========================================================================

  /**
   * Resolves a 6-digit Indian PIN code into Village/Town, Taluk, District, and State
   */
  public async lookupPincode(pincode: string): Promise<GlobalLocationState | null> {
    const cleanPin = pincode.trim().replace(/\D/g, '');
    if (cleanPin.length !== 6) return null;

    // 1. Search Embedded Hierarchy First (Fast offline resolution)
    for (const st of INDIA_GEOGRAPHIC_HIERARCHY) {
      for (const dist of st.districts) {
        for (const tal of dist.taluks) {
          // Check taluk-level pincodes
          if (tal.pincodes && tal.pincodes.includes(cleanPin)) {
            return {
              country: 'India',
              state: st.state,
              district: dist.name,
              taluk: tal.name,
              townOrVillage: tal.name,
              city: tal.name,
              pincode: cleanPin,
              latitude: tal.latitude,
              longitude: tal.longitude,
              region: st.region,
              locationType: 'taluk',
              formattedAddress: `${tal.name} Taluk, ${dist.name}, ${st.state} - ${cleanPin}`
            };
          }

          // Check village-level pincodes
          for (const vt of tal.villagesAndTowns) {
            if (vt.pincode === cleanPin) {
              return {
                country: 'India',
                state: st.state,
                district: dist.name,
                taluk: tal.name,
                village: vt.type === 'village' || vt.type === 'gram_panchayat' ? vt.name : undefined,
                townOrVillage: vt.name,
                city: vt.name,
                pincode: cleanPin,
                latitude: vt.latitude || tal.latitude,
                longitude: vt.longitude || tal.longitude,
                region: st.region,
                locationType: vt.type,
                formattedAddress: `${vt.name}, ${tal.name} Taluk, ${dist.name}, ${st.state} - ${cleanPin}`
              };
            }
          }
        }
      }
    }

    // 2. Query India Post Public API
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const villageOrTown = po.Name;
          const taluk = po.Block || po.Taluk || po.SubDistrict || po.District;
          const district = po.District;
          const state = po.State;
          const region = this.getRegionForState(state);

          // Get approximate coordinates via OpenStreetMap Nominatim
          let lat = 12.9716;
          let lng = 77.5946;

          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/search?postalcode=${cleanPin}&country=india&format=json&limit=1`
            );
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              if (geoData.length > 0) {
                lat = parseFloat(geoData[0].lat);
                lng = parseFloat(geoData[0].lon);
              }
            }
          } catch {
            // Geocoding coords fallback
          }

          const resolved: GlobalLocationState = {
            country: 'India',
            state,
            district,
            taluk: taluk !== district ? taluk : undefined,
            village: villageOrTown,
            townOrVillage: villageOrTown,
            city: villageOrTown,
            pincode: cleanPin,
            locality: po.Division,
            latitude: Number(lat.toFixed(4)),
            longitude: Number(lng.toFixed(4)),
            region,
            locationType: 'village',
            formattedAddress: `${villageOrTown}, ${taluk ? `${taluk} Taluk, ` : ''}${district}, ${state} - ${cleanPin}`
          };
          return resolved;
        }
      }
    } catch (err) {
      console.warn('India Post PIN API request error:', err);
    }

    return null;
  }

  // =========================================================================
  // UNIVERSAL SEARCH (Village, Town, City, District, PIN Code)
  // =========================================================================

  /**
   * Search across offline dataset and live OpenStreetMap for ANY village, town, or district in India
   */
  public async searchUniversal(query: string): Promise<GlobalLocationState[]> {
    if (!query || query.trim().length < 2) return [];

    const q = query.trim().toLowerCase();
    const results: GlobalLocationState[] = [];
    const seenKeys = new Set<string>();

    // 1. PIN Code Direct Match
    if (/^\d{6}$/.test(q)) {
      const pinResult = await this.lookupPincode(q);
      if (pinResult) {
        results.push(pinResult);
        seenKeys.add(`${pinResult.city}-${pinResult.district}-${pinResult.state}`);
      }
    }

    // 2. Search Embedded Comprehensive Dataset
    for (const st of INDIA_GEOGRAPHIC_HIERARCHY) {
      for (const dist of st.districts) {
        for (const tal of dist.taluks) {
          // Match Taluk
          if (tal.name.toLowerCase().includes(q)) {
            const key = `${tal.name}-${dist.name}-${st.state}`;
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              results.push({
                country: 'India',
                state: st.state,
                district: dist.name,
                taluk: tal.name,
                townOrVillage: tal.name,
                city: tal.name,
                pincode: tal.pincodes?.[0],
                latitude: tal.latitude,
                longitude: tal.longitude,
                region: st.region,
                locationType: 'taluk',
                formattedAddress: `${tal.name} Taluk, ${dist.name} District, ${st.state}`
              });
            }
          }

          // Match Villages and Towns
          for (const vt of tal.villagesAndTowns) {
            if (
              vt.name.toLowerCase().includes(q) ||
              (vt.pincode && vt.pincode.includes(q))
            ) {
              const key = `${vt.name}-${tal.name}-${dist.name}-${st.state}`;
              if (!seenKeys.has(key)) {
                seenKeys.add(key);
                results.push({
                  country: 'India',
                  state: st.state,
                  district: dist.name,
                  taluk: tal.name,
                  village: vt.type === 'village' || vt.type === 'gram_panchayat' ? vt.name : undefined,
                  townOrVillage: vt.name,
                  city: vt.name,
                  pincode: vt.pincode || tal.pincodes?.[0],
                  latitude: vt.latitude || tal.latitude,
                  longitude: vt.longitude || tal.longitude,
                  region: st.region,
                  locationType: vt.type,
                  formattedAddress: `${vt.name}${vt.type === 'village' ? ' Village' : ''}, ${tal.name} Taluk, ${dist.name}, ${st.state}${vt.pincode ? ` - ${vt.pincode}` : ''}`
                });
              }
            }
          }
        }

        // Match District Name
        if (dist.name.toLowerCase().includes(q)) {
          const key = `dist-${dist.name}-${st.state}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            results.push({
              country: 'India',
              state: st.state,
              district: dist.name,
              city: dist.name,
              latitude: dist.latitude,
              longitude: dist.longitude,
              region: st.region,
              locationType: 'district',
              formattedAddress: `${dist.name} District, ${st.state}`
            });
          }
        }
      }
    }

    // 3. Query OpenStreetMap Nominatim for Rural Settlements Across India
    try {
      const osmRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=in&format=jsonv2&addressdetails=1&limit=6`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'PregNutriAI-RuralLocationEngine/1.0'
          }
        }
      );

      if (osmRes.ok) {
        const osmData = await osmRes.json();
        for (const item of osmData) {
          const addr = item.address || {};
          const state = addr.state || 'Karnataka';
          const district = addr.state_district || addr.district || addr.county || 'Mysuru';
          const village =
            addr.village ||
            addr.hamlet ||
            addr.isolated_dwelling ||
            addr.town ||
            addr.city ||
            item.name;

          const taluk =
            addr.subdistrict ||
            addr.tehsil ||
            addr.taluk ||
            addr.mandal ||
            addr.county;

          const pin = addr.postcode ? addr.postcode.replace(/\D/g, '').slice(0, 6) : undefined;
          const key = `${village}-${district}-${state}`;

          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            const lat = parseFloat(item.lat);
            const lng = parseFloat(item.lon);
            const reg = this.getRegionForState(state);

            results.push({
              country: 'India',
              state,
              district,
              taluk: taluk !== district ? taluk : undefined,
              village: addr.village || addr.hamlet ? village : undefined,
              townOrVillage: village,
              city: village,
              pincode: pin,
              latitude: Number(lat.toFixed(4)),
              longitude: Number(lng.toFixed(4)),
              region: reg,
              locationType: addr.village || addr.hamlet ? 'village' : 'town',
              formattedAddress: `${village}, ${taluk ? `${taluk} Taluk, ` : ''}${district}, ${state}${pin ? ` - ${pin}` : ''}`
            });
          }
        }
      }
    } catch {
      // Ignore network timeout
    }

    return results.slice(0, 10);
  }
}

export const globalLocationService = GlobalLocationService.getInstance();

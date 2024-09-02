export interface Activity {
  resource_state: number
  athlete: Athlete
  name: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  type: string
  sport_type: string
  workout_type: null
  id: number
  start_date: string
  start_date_local: string
  timezone: string
  utc_offset: number
  location_city: null
  location_state: null
  location_country: string
  achievement_count: number
  kudos_count: number
  comment_count: number
  athlete_count: number
  photo_count: number
  map: StravaMap
  trainer: boolean
  commute: boolean
  manual: boolean
  private: boolean
  visibility: string
  flagged: boolean
  gear_id: null
  start_latlng: any[]
  end_latlng: any[]
  average_speed: number
  max_speed: number
  has_heartrate: boolean
  heartrate_opt_out: boolean
  display_hide_heartrate_option: boolean
  elev_high: number
  elev_low: number
  upload_id: number
  upload_id_str: string
  external_id: string
  from_accepted_tag: boolean
  pr_count: number
  total_photo_count: number
  has_kudoed: boolean
}

export interface Athlete {
  id: number
  resource_state: number
}

export interface StravaMap {
  id: string
  summary_polyline: string
  resource_state: number
}

export type Activities = Activity[]

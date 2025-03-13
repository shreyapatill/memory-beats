import os
from flask import Flask, jsonify, request
import requests
import urllib.parse
from datetime import datetime
from dotenv import load_dotenv
from flask_cors import CORS

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Spotify API credentials
CLIENT_ID = os.environ.get('SPOTIFY_CLIENT_ID')
CLIENT_SECRET = os.environ.get('SPOTIFY_CLIENT_SECRET')
REDIRECT_URI = os.environ.get('REDIRECT_URI', 'http://localhost:5000/callback')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Spotify API endpoints
TOKEN_URL = 'https://accounts.spotify.com/api/token'
API_BASE_URL = 'https://api.spotify.com/v1/'

def get_spotify_token():
    """Get a Spotify API token using client credentials flow"""
    auth_options = {
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }
    
    response = requests.post(TOKEN_URL, data=auth_options)
    if response.status_code == 200:
        return response.json()['access_token']
    return None

@app.route('/api/songs', methods=['POST'])
def get_songs():
    """Get songs from childhood years based on birth year and location"""
    data = request.json
    
    # Get form data from request
    birth_year = int(data.get('birthYear'))
    location = data.get('location')
    childhood_start = int(data.get('childhoodStart', 5))
    childhood_end = int(data.get('childhoodEnd', 15))
    
    # Calculate the years of childhood
    start_year = birth_year + childhood_start
    end_year = birth_year + childhood_end
    
    # Get the access token
    access_token = get_spotify_token()
    
    if not access_token:
        return jsonify({'error': 'Failed to authenticate with Spotify API'}), 500
    
    # Get songs from the childhood period
    songs = get_childhood_songs(access_token, start_year, end_year, location)
    
    return jsonify({
        'songs': songs,
        'birthYear': birth_year,
        'location': location,
        'startYear': start_year,
        'endYear': end_year
    })

def get_childhood_songs(access_token, start_year, end_year, location, limit=30):
    """Get popular songs from the specified childhood years"""
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    
    all_songs = []
    
    # Search for popular tracks from each year
    for year in range(start_year, end_year + 1):
        # Format search query for top tracks of the year
        search_query = f'year:{year}'
        
        # Add market parameter if location is provided
        market_param = ''
        if location:
            # Convert country name to ISO code (simplified approach)
            country_map = {
                'united states': 'US',
                'uk': 'GB',
                'united kingdom': 'GB',
                'canada': 'CA',
                # Add more as needed
            }
            country_code = country_map.get(location.lower(), location.upper())
            market_param = f'&market={country_code}'
        
        # Make the search request to Spotify
        encoded_query = urllib.parse.quote(search_query)
        response = requests.get(
            f'{API_BASE_URL}search?q={encoded_query}&type=track&limit={limit//10}{market_param}',
            headers=headers
        )
        
        # Process the results
        if response.status_code == 200:
            results = response.json()
            
            # Extract relevant song information
            for item in results['tracks']['items']:
                song = {
                    'id': item['id'],
                    'name': item['name'],
                    'artist': item['artists'][0]['name'],
                    'album': item['album']['name'],
                    'releaseDate': item['album']['release_date'],
                    'previewUrl': item['preview_url'],
                    'spotifyUrl': item['external_urls']['spotify'],
                    'year': year
                }
                
                # Add album image if available
                if item['album']['images'] and len(item['album']['images']) > 0:
                    song['imageUrl'] = item['album']['images'][0]['url']
                
                all_songs.append(song)
    
    # Limit and return the songs
    return all_songs[:limit]

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        'status': 'ok',
        'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    })

if __name__ == '__main__':
    # For development
    app.run(host='0.0.0.0', port=5000, debug=True)
#!/bin/bash

# Supabase Database Setup Script
# This script helps set up the database schema for the Polling App

set -e

echo "🚀 Setting up Supabase Database Schema for Polling App"
echo "=================================================="

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL is not set"
    echo "Please set your environment variables first:"
    echo "cp env.example .env.local"
    echo "Then edit .env.local with your actual Supabase credentials"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
    echo "Please set your environment variables first:"
    echo "cp env.example .env.local"
    echo "Then edit .env.local with your actual Supabase credentials"
    exit 1
fi

echo "✅ Environment variables are set"
echo "📊 Supabase URL: $NEXT_PUBLIC_SUPABASE_URL"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
fi

echo "🔧 Supabase CLI is available"

# Extract project reference from URL
PROJECT_REF=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's|https://||' | sed 's|.supabase.co||')

echo "🔗 Project Reference: $PROJECT_REF"

# Check if project is already linked
if [ -f ".supabase/config.toml" ]; then
    echo "✅ Project is already linked"
else
    echo "🔗 Linking project..."
    supabase link --project-ref $PROJECT_REF
fi

echo "📋 Running database schema..."
supabase db reset --linked

echo "✅ Database schema setup complete!"
echo ""
echo "🎉 Your Supabase database is now ready with:"
echo "   - Users table with authentication"
echo "   - Polls table for storing poll data"
echo "   - Poll options table for poll choices"
echo "   - Votes table for user votes"
echo "   - Row Level Security (RLS) policies"
echo "   - Performance indexes and views"
echo ""
echo "🔐 Next steps:"
echo "   1. Test your database connection"
echo "   2. Create your first poll"
echo "   3. Set up authentication flows"
echo ""
echo "📚 For more information, see: supabase/README.md"

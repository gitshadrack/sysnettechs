<?php
use Illuminate\Support\Facades\Artisan;use Illuminate\Support\Facades\DB;use Illuminate\Support\Facades\Schedule;use Illuminate\Support\Facades\Storage;
Artisan::command('backup:run',function(){ $tables=['users','contents','enquiries','chat_conversations','chat_messages','site_settings'];$payload=['created_at'=>now()->toIso8601String(),'database'=>config('database.default'),'tables'=>[]];foreach($tables as $table)$payload['tables'][$table]=DB::table($table)->get()->toArray();$name='backups/sysnettech-'.now()->format('Y-m-d-His').'.json';Storage::disk('local')->put($name,json_encode($payload,JSON_PRETTY_PRINT));$this->info("Backup written to {$name}"); })->purpose('Create an application data backup');
Schedule::command('backup:run')->dailyAt('02:00')->withoutOverlapping();

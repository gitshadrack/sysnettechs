<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;use Illuminate\Database\Eloquent\Factories\HasFactory;
class Content extends Model{use HasFactory;protected $fillable=['type','title','slug','excerpt','body','image','meta_title','meta_description','status','sort_order','published_at','data'];protected function casts():array{return ['data'=>'array','published_at'=>'datetime'];}}

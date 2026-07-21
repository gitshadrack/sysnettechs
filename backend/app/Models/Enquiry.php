<?php
namespace App\Models;use Illuminate\Database\Eloquent\Model;use Illuminate\Database\Eloquent\Factories\HasFactory;
class Enquiry extends Model{use HasFactory;protected $fillable=['kind','name','company','email','phone','service','position','message','attachment','status','meta'];protected function casts():array{return ['meta'=>'array'];}}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contents', function (Blueprint $t) {
            $t->id();
            $t->string('type')->index();
            $t->string('title');
            $t->string('slug')->index();
            $t->text('excerpt')->nullable();
            $t->longText('body')->nullable();
            $t->string('image')->nullable();
            $t->string('meta_title', 70)->nullable();
            $t->string('meta_description', 170)->nullable();
            $t->string('status')->default('draft')->index();
            $t->unsignedInteger('sort_order')->default(0);
            $t->timestamp('published_at')->nullable()->index();
            $t->json('data')->nullable();
            $t->timestamps();
            $t->unique(['type', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contents');
    }
};

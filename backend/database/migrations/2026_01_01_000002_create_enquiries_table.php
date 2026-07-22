<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enquiries', function (Blueprint $t) {
            $t->id();
            $t->string('kind')->index();
            $t->string('name');
            $t->string('company')->nullable();
            $t->string('email')->index();
            $t->string('phone', 40);
            $t->string('service')->nullable();
            $t->string('position')->nullable();
            $t->text('message');
            $t->string('attachment')->nullable();
            $t->string('status')->default('new')->index();
            $t->json('meta')->nullable();
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enquiries');
    }
};

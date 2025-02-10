import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("Program")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    console.log(data)
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data program" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  try {
    const { data, error } = await supabase
      .from("Program")
      .insert([body])
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Gagal membuat program" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  try {
    const { data, error } = await supabase
      .from("Program")
      .update(body)
      .eq("id", body.id)
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memperbarui program" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { id } = await request.json();

  try {
    const { error } = await supabase
      .from("Program")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghapus program" },
      { status: 500 }
    );
  }
}